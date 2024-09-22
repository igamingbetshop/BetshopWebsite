import { Injectable } from '@angular/core';
import {ConfigService} from "./config.service";
import {Observable} from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {getTimeZone} from "../utils";
import {AuthService} from "./auth.service";
import { ApiResponse } from '../interfaces/api-response';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly apiUrl:string;
  readonly languageId:string;

  public authService!:AuthService;

  constructor(private configService:ConfigService, private http:HttpClient)
  {
    this.apiUrl = this.configService.settings.ApiUrl;
    this.languageId = localStorage.getItem("language") || this.configService.settings.DefaultLanguage;
  }

  post(endpoint: string, data: any): Observable<any>
  {
    data.TimeZone = getTimeZone();
    data.LanguageId = this.languageId;
    if(this.authService.isAuthenticated)
    {
      data.Token = this.authService.getToken;
    }
    return this.http.post(`${this.apiUrl}/${endpoint}`, data, {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
    });
  }

  apiCall(method:string, params?:any, loading?:boolean)
  {
    const data:any = {};
    const cashier = this.authService.getCashier;
    data.PartnerId = cashier.PartnerId;
    data.CashDeskId = cashier.CashDeskId;
    data.LanguageId = this.languageId;
    data.TimeZone = getTimeZone();
    data.Method = method;
    data.Token = this.authService.getToken;
    data.Loading = loading;
    if(params)
      data['RequestObject'] = JSON.stringify(params);

    return this.http.post<ApiResponse>(`${this.apiUrl}/ApiRequest`, data, {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
    });
  }
}
