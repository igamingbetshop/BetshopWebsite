import { Injectable } from '@angular/core';
import {ApiService} from "./api.service";
import {tap} from "rxjs";
import {Cashier} from "../interfaces/cashier";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private apiService:ApiService)
  {
    this.apiService.authService = this;
  }

  get getCashier(): Cashier
  {
    const data = localStorage.getItem('cashierData');
    return data ? JSON.parse(data) : null;
  }

  get isAuthenticated(): boolean
  {
    // const token = localStorage.getItem('token');
    // return !!token;
    const data:any = localStorage.getItem('cashierData');
    return !!data;
  }

  get getToken()
  {
    return localStorage.getItem('token');
  }

  login(method:string, data:any)
  {
    return this.apiService.post(method, data).pipe(tap(resp => {
      if(resp.ResponseCode === 0)
      {
        const { ResponseCode,ResponseObject,Description, ...cashierData } = resp;
        localStorage.setItem("cashierData", JSON.stringify(cashierData));
        localStorage.setItem("token", resp.Token);
        window.location.href = '/';
      }
    }));
  }

  logout()
  {
    localStorage.clear();
    location.href = "/login";
    /*this.apiService.apiCall(Methods.LOGOUT).pipe(take(1)).subscribe(data => {

    });*/
  }
}
