import { Injectable, WritableSignal, signal } from '@angular/core';
import { ApiService } from './api.service';
import { Methods } from '../enums';
import { timer } from 'rxjs';
import { Balance } from '../classes/balance';

@Injectable({
  providedIn: 'root'
})
export class BalanceService {

  balance:WritableSignal<Balance> = signal(new Balance());

  constructor(private apiServcie:ApiService)
  {
    timer(0, 10000).subscribe(data => {
      this.getBalance();
    });
  }

  getBalance()
  {
    this.apiServcie.apiCall(Methods.GET_BALANCE, {}, false).subscribe(data => {
        if(data.ResponseCode === 0)
        {
          this.balance.set(data.ResponseObject as Balance);

        }
    });
  }
}
