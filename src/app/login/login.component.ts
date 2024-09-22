import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Inject,
  inject,
  OnInit,
  signal,
  ViewEncapsulation
} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthService} from "../core/services/auth.service";
import {take} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {SignalrService} from '../core/services/signalr.service';
import {Methods} from '../core/enums';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {DOCUMENT} from "@angular/common";

@Component({
  selector: 'bs-login',
  standalone: true,
  imports: [ReactiveFormsModule, MatSnackBarModule, MatFormField, MatInput, MatLabel, MatButton, MatIcon],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation:ViewEncapsulation.None,
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit
{

  formGroup!:FormGroup;
  errorText = signal("");
  terminalConfig:any;

  private destroyHref = inject(DestroyRef);

  constructor(
     private authService:AuthService,
     private route:ActivatedRoute,
     private snackBar:MatSnackBar,
     private signalR:SignalrService,
     @Inject(DOCUMENT) private document:Document)
  {
    this.signalR.onConnect().pipe(takeUntilDestroyed(this.destroyHref)).subscribe(connect => {
      if(connect)
      {
        this.signalR.sendMessage(Methods.GET_APP_SETTINGS).pipe(takeUntilDestroyed(this.destroyHref)).subscribe(data => {
          this.terminalConfig = data;
      });
      }
    });
    this.destroyHref.onDestroy(() => {
      this.document.body.classList.remove("login");
    });
  }

  ngOnInit()
  {
    this.document.body.classList.add("login");
    this.formGroup = new FormGroup({
      UserName: new FormControl('', Validators.required),
      Password: new FormControl('', Validators.required)
    });
  }

  submit()
  {
    const hash =  this.route.snapshot.queryParamMap.get("hash");
    const partnerId =  this.route.snapshot.queryParamMap.get("partnerId");
    let method = Methods.AUTHORIZATION;
    if(this.formGroup.valid)
    {
      const loginData = this.formGroup.getRawValue();

      if(hash && partnerId)
      {
        loginData.Hash = hash;
        loginData.PartnerId = partnerId;
      }
      else
      {
        if(this.terminalConfig)
        {
          loginData.Hash = this.terminalConfig.Hash;
          loginData.PartnerId = this.terminalConfig.PartnerId;
          loginData.ExternalId = this.terminalConfig.MacAddress;
          method = Methods.LOGIN;
        }
        else
        {
          this.snackBar.open("Terminal is not running", "", {panelClass:["error-snackbar"]});
          return;
        }

      }

      this.errorText.set("");
      this.authService.login(method, loginData).pipe(take(1)).subscribe(resp => {
          if(resp.ResponseCode !== 0)
          {
            this.errorText.set(resp.Description);
          }
      });
    }
  }
}
