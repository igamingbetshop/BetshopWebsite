import { Injectable } from '@angular/core';
import * as signalR from "@microsoft/signalr";
import {Observable, Subject, from, of, tap} from 'rxjs';
import { LoaderService } from './loader.service';
import {ConfigService} from "./config.service";
import {AuthService} from "./auth.service";
import {getTimeZone} from "../utils";

@Injectable({
  providedIn: 'root'
})
export class SignalrService {

  private notifyConnection: Subject<boolean> = new Subject<boolean>();
  onConnected = this.notifyConnection.asObservable();
  connectionExists: boolean = false;
  connection:any;

  private notifyBackendConnection: Subject<boolean> = new Subject<boolean>();
  onBackendConnected = this.notifyBackendConnection.asObservable();
  backendConnectionExists: boolean = false;
  backendConnection:any;

  private betNotifier:Subject<any> = new Subject<any>();
  public onBet$ = this.betNotifier.asObservable();
  languageId:string;

  constructor(private loader:LoaderService, private config:ConfigService, private authService:AuthService)
  {
    this.languageId = localStorage.getItem("lang") || this.config.settings.DefaultLanguage;
    this.init();
  }

  init()
  {
    this.connection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Information)
      .withUrl("http://localhost:9011/api/signalr/basehub")
      .withAutomaticReconnect()
      .build();
    this.connection.start()
      .then(() => {
          this.connectionExists = true;
          this.notifyConnection.next(true);
          console.log("connected");
      })
      .catch(function (err:any) {
          return console.error(err.toString());
      });

    const cashier = this.authService.getCashier;
    if(cashier)
    {
      this.backendConnection = new signalR.HubConnectionBuilder()
        .configureLogging(signalR.LogLevel.Information)
        .withUrl(`${this.config.settings.SocketUrl}/basehub?token=${cashier.Token}&partnerid=${cashier.PartnerId}&cashdeskid=${cashier.CashDeskId}&languageid=${this.languageId}&timezone=${getTimeZone()}`)
        .withAutomaticReconnect()
        .build();
      this.backendConnection.start()
        .then(() => {
          this.backendConnectionExists = true;
          this.notifyBackendConnection.next(true);
          console.log("backend connected");
          this.backendConnection.on('onBet', (data:any) => this.betNotifier.next(data));
        })
        .catch(function (err:any) {
          return console.error(err.toString());
        });
    }

  }

  onConnect(): Observable<boolean>
  {
    return this.connectionExists ? of(true) : this.onConnected;
  }

  onBackendConnect(): Observable<boolean>
  {
    return this.backendConnectionExists ? of(true) : this.onBackendConnected;
  }

  sendMessage(methodName:string,  ...args: any[])
  {
    //this.loader.show();

    return from(this.connection.invoke(methodName, ...args)).pipe(tap(data => {
        this.loader.hide();
    }));
  }
}
