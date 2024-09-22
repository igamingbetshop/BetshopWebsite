import {ChangeDetectionStrategy, Component, inject, signal, WritableSignal} from '@angular/core';
import {MatDialogClose} from "@angular/material/dialog";
import {MatIcon} from "@angular/material/icon";
import {ApiService} from "../../core/services/api.service";
import {MatIconButton} from "@angular/material/button";
import {Methods} from "../../core/enums";
import {getDefaultRange} from "../../core/utils";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {DatePipe} from "@angular/common";
import {BalanceService} from "../../core/services/balance.service";
import {AuthService} from "../../core/services/auth.service";

@Component({
  selector: 'bs-cashbox',
  standalone: true,
  imports: [
    MatDialogClose,
    MatIcon,
    MatIconButton,
    DatePipe
  ],
  templateUrl: './cashbox.component.html',
  styleUrl: './cashbox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CashboxComponent {
  apiService = inject(ApiService);
  defaultRange = getDefaultRange(1);
  balanceService = inject(BalanceService);
  authService = inject(AuthService);
  data:WritableSignal<any> = signal({
    Deposit:0,
    Withdraw:0,
    Amount:0,
    Total:0,
    Fee:0,
    Payout:0,
    CanceledBets:0,
    TotalBets:0,
    CreditPayout:0
  });

  constructor()
  {
    this.apiService.apiCall(Methods.GET_SHIFT_REPORT, this.defaultRange).pipe(takeUntilDestroyed()).subscribe((resp:any) => {
      if(resp.ResponseCode === 0)
      {
        if(resp.ResponseObject.Shifts.length)
        {
          const shift = resp.ResponseObject.Shifts[0];
          this.data.update(current => ({...current,
            ...{
              Deposit:shift.DepositToInternetClients,
              Withdraw:shift.WithdrawFromInternetClients,
              Amount:shift.BetAmounts,
              Payout:shift.PayedWins
            }
          }));
        }
      }
    });
  }

}
