import {Inject, Injectable, LOCALE_ID, signal, WritableSignal} from '@angular/core';
import { SignalrService } from './signalr.service';
import { Methods } from '../enums';
import { Shift } from '../interfaces';
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root',
})
export class PrintService {

  printers:WritableSignal<string[]> = signal([]);
  thermalPrinter:WritableSignal<string> = signal("");
  solidInkPrinter:WritableSignal<string> = signal("");

  constructor(private signalR:SignalrService, private authService:AuthService, @Inject(LOCALE_ID) public locale: string)
  {
    window.addEventListener("message", event => {
      if(event && event.data && event.data.onPlaceBet)
      {
        this.printBetTicket(event.data.onPlaceBet);
      }
    });
    this.signalR.onBet$.subscribe(bet => {
      this.printBetTicket(bet);
    });
    this.signalR.onConnect().subscribe(connect => {
      if(connect)
      {
        this.signalR.sendMessage(Methods.GET_PRINTERS).subscribe((printers) => {

            this.printers.set(printers as string[]);
            const thermalPrinter = localStorage.getItem("thermal-printer");
            const solidInkPrinter = localStorage.getItem("solidInk-printer");

            const setAndRemovePrinter = (printer: string | null, type: string) => {
              if (printer && this.printers().includes(printer))
              {
                this.setPrinter(printer, type);
              }
              else
              {
                localStorage.removeItem(`${type}-printer`);
              }
            };
            setAndRemovePrinter(thermalPrinter, "thermal");
            setAndRemovePrinter(solidInkPrinter, "solidInk");
        });
      }
    });
  }

  setPrinter(printer: string, type: string) {
    const selectedPrinter = type === "thermal" ? this.thermalPrinter : this.solidInkPrinter;
    if (selectedPrinter)
    {
      selectedPrinter.set(printer);
      localStorage.setItem(`${type}-printer`, printer);
    }
    else
    {
      console.error(`${type} printer is not initialized.`);
    }
  }

  printBetTicket(bet:any, copy = false)
  {
    const betTypeNames: { [key: number]: string } = {
      1: 'Single',
      2: 'Express',
      3: 'System'
    };

    let betTypeName = betTypeNames[bet.BetType || bet.TypeId] || '';

    bet.CommissionFee = bet.CommissionFee || 0;

    const currency = new Intl.NumberFormat('de-DE', { style: 'currency', currency: this.authService.getCashier.BetShopCurrencyId});
    let amount = bet.Amount || bet.BetAmount;
    let stakeValue = currency.format(amount - bet.CommissionFee);
    let totalValue = currency.format(amount);
    let possibleWin = currency.format(bet.PossibleWin || 0);
    let amountPerBet = currency.format(bet.AmountPerBet || 0);
    let fee = currency.format(bet.CommissionFee);

    bet.NumberOfBets = bet.NumberOfBets || "";
    bet.ForcedChosenCount = 0;
    let mappedSelections = [];
    let multiway = false;
    const matches = new Map();
    if(bet.BetSelections)
    {
      mappedSelections = bet.BetSelections.map((selection:any) => {
        const teams = selection.UnitName ?  selection.UnitName.split("-") : ["",""];
        let match_date = '-';
        let match_time = '-';
        if(selection.EventDate)
        {
          let t = selection.EventDate.replace('Z', '');
          const eventDate = new Date(t);
          let minute:any = eventDate.getMinutes();
          let hours:any = eventDate.getHours();
          let day:any = eventDate.getDate();
          let month:any = eventDate.getMonth() + 1;
          minute = minute < 10 ? "0" + minute : minute.toString();
          hours = hours < 10 ? "0" + hours : hours.toString();
          day = day < 10 ? "0" + day : day.toString();
          month = month < 10 ? "0" + month : month.toString();
          match_date = day + '.' + month;
          match_time = hours + '.' + minute;
        }
        let state = selection.MatchState ? this.parseResult(selection.MatchState) : null;
        if(selection.ForcedChosen)
          bet.ForcedChosenCount++;
        if(!multiway)
        {
          if(matches.has(selection.MatchId))
            multiway = true;
          else matches.set(selection.MatchId, selection.MatchId);
        }
        const mappedSelection = {
          "Id": selection.SelectionId.toString(),
          "MatchDate": match_date,
          "MatchTime": match_time,
          "Team1": teams[0],
          "Team2": teams[1],
          "CurrentTime": state && state.time ? this.parseTime(bet, state.time) : "",
          "Score": state && state.part1 ? state?.part1?.[0] + ":" +  state?.part1?.[1] : "",
          "ForcedChosen": selection.ForcedChosen,
          "MatchName": selection.MarketName || "",
          "SelectionName": selection.SelectionName || "",
          "Coefficient": selection.Coefficient.toString(),
          "EventInfo": selection.EventInfo,
          "RoundId": selection.RoundId,
          "EventInfoLabel":"Event info",
          "RoundIdLabel":"Round",
          "SportName":selection.SportName,
          "CompetitionName":selection.CompetitionName
        }

        return mappedSelection;
      });
    }
    bet.SystemName = bet.BetType === 3 ? bet.SystemOutCounts.join("/") + " " +  "Out of" + " " + bet.NumberOfMatches : "";
    bet.Multiway = multiway ? "Multiway" : "";
    bet.ForcedChosenName = bet.ForcedChosenCount ?  bet.ForcedChosenCount + "B + " : "";

    if(bet.BetType == 3)
    {
      const forceChosenName = bet.ForcedChosenCount ? bet.ForcedChosenCount + "B + " : "";
      betTypeName = betTypeName + " " +  forceChosenName + bet.SystemOutCounts.join("/") + " " +  "Of" + " " + bet.NumberOfMatches;
    }
    const betDate = new Date(bet.BetDate).toLocaleString();

    const payload = {
      Title:"Betslip",
      TicketNumber:bet.TicketNumber.toString(),
      BetType:betTypeName,
      ShopAddress:this.authService.getCashier.BetShopAddress,
      Barcode: copy ? "" :  bet.Barcode.toString(),
      CurrencySymbol:this.authService.getCashier.BetShopCurrencyId,
      PrintDate:betDate,
      IsDuplicate:copy,
      PrinterName:this.thermalPrinter(),
      BetDetails:{
        BetAmountLabel:"Stake",
        BetAmount:stakeValue,
        FeeLabel:"Fee",
        FeeValue:fee,
        BetsNumberLabel:"Bets",
        BetsNumber: bet.NumberOfBets.toString(),
        Multiway: bet.Multiway,
        ForcedChosenName: bet.ForcedChosenName,
        SystemName: bet.SystemName,
        AmountPerBetLabel:"Amount per Bet",
        AmountPerBet:amountPerBet,
        TotalAmountLabel:"Total",
        TotalAmount:totalValue,
        PossibleWinLabel:"Possible Win",
        PossibleWin:possibleWin,
        Selections:mappedSelections,
        TotalCoefficientLabel:"Total Coefficient",
        TotalCoefficient:bet.Coefficient
      }
    }

    this.signalR.sendMessage(Methods.PRINT_RECEIPT, payload).subscribe(data => {

    });
  }

  printShiftTicket(shift:Shift)
  {

  }

  printPaymentTicket()
  {

  }

  printWithdraw(data:any)
  {
    const currency = new Intl.NumberFormat(this.locale, { style: 'currency', currency: this.authService.getCashier.BetShopCurrencyId});
    const amount = currency.format(data.Amount || 0);

    const payload = {
      Title:"TestTitle",
      ShopAddress:this.authService.getCashier.BetShopAddress,
      PrintDateLabel:"Pay Date",
      PrintDate:data.PayDate,
      WithdrawIdLabel:"Payment Id",
      WithdrawId:data.TransactionId,
      AmountLabel:"Amount",
      Amount:amount,
      Description:"Test Description",
      AttentionMessage:"Attention Message",
      PrinterName:this.thermalPrinter(),
      Barcode:data.Barcode
    }
    this.signalR.sendMessage(Methods.PRINT_WITHDRAW_RECEIPT, payload);
  }

  private getPrinters()
  {

  }

  private parseResult(resultInfo:any)
  {
    if (resultInfo)
    {
      let result:any = { 'part1': false, 'part2': false, 'part3': false, 'phase':''};
      let a = resultInfo.indexOf('(');
      let b = resultInfo.indexOf(')');

      if (a > -1) {

        let p1 = resultInfo.substr(0, a).trim();
        result.part1 = this.splitItem(p1);
      }

      if (b > -1) {

        let p2 = resultInfo.substr(a + 1, b - a - 1).trim();

        let c = p2.indexOf(' ') > -1 ? p2.split(' ') : p2.split(',');

        if (c.length > 0) {

          result.part2 = [];

          for (let i = 0; i < c.length; i++) {

            result.part2.push(this.splitItem(c[i]));
          }
        }

        let p3 = resultInfo.substr(b + 1).trim();
        result.part3 = this.splitItem(p3);

        const splitData = resultInfo.split(', ');
        result.phase = splitData[1];
        result.time = splitData[2] == "0 : 0" ? "" : splitData[2];
      }

      return result;

    } else {

      return { 'part1': ['-', '-'] };
    }
  }

  private splitItem(item:any)
  {
    let a = item ? item.split(':') : [];
    return a.length > 0 ? [a[0], a[1]] : false;
  }

  parseTime(bet:any, time:any)
  {
    let result = "";
    switch (bet.SportId)
    {
      case 3:
      case 4:
      case 9:
      case 18:
      case 19:
      case 20:
        result = "Set is playing";
        break;
      default:
        if(time)
        {
          let s = time.split(" ");
          if(time.includes("("))
          {
            result = s[0] + "'" + "(" + s[2].split("(")[1] + "'" + ")";
          }
          else
          {
            result = s[0] + "'";
          }
        }
    }
    return result;
  }
}
