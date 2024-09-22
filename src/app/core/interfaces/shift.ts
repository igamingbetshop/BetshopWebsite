export interface Shift {
  Id:number;
  BetShopId:number;
  CashDeskId:number;
  StartAmount:number;
  BetAmount:number;
  PayedWin:number;
  DepositToInternetClientn:number;
  WithdrawFromInternetClient:number;
  DebitCorrectionOnCashDesk:number;
  CreditCorrectionOnCashDesk:number;
  Balance:number;
  EndAmount:number;
  BonusAmount:number;
  CashierFirstName: string;
  CashierLastName: string;
  BetShopAddress:string;
  StartTime:Date;
  EndTime:Date,
}
