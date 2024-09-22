import { ClientAccount } from './../../../core/interfaces/client-account';
import { ChangeDetectionStrategy, Component, DestroyRef, WritableSignal, inject, signal } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/core/services/api.service';
import { Methods } from 'src/app/core/enums';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Client } from 'src/app/core/interfaces';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {PrintService} from "../../../core/services/print.service";

@Component({
  selector: 'bs-client',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule,
     ReactiveFormsModule, MatButtonModule, MatSnackBarModule],
  templateUrl: './client.component.html',
  styleUrl: './client.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientComponent {

  private route = inject(ActivatedRoute);
  private apiService = inject(ApiService);
  private destroyRef = inject(DestroyRef);
  private location = inject(Location);
  private snackBar = inject(MatSnackBar);
  private printService = inject(PrintService);

  private clientId!:number;
  formGroup!:FormGroup;

  openedDeposit:boolean = false;
  openedWithdraw:boolean = false;
  openedAccount:ClientAccount = {
    AccountTypeName:"",
    Balance:0,
    BetShopId:0,
    CurrencyId:"",
    PaymentSystemId:0,
    Id:0
  };
  withdrawAmount:string = "";
  depositAmount:string = "";

  constructor()
  {
    this.clientId = this.route.snapshot.queryParams['clientId'];
    this.getClient();
    this.formGroup = new FormGroup({
      Id: new FormControl(''),
      FirstName: new FormControl(''),
      CurrencyId: new FormControl(''),
      LastName: new FormControl(''),
      UserName: new FormControl(''),
      Email: new FormControl(''),
      MobileNumber: new FormControl(''),
      Address: new FormControl(''),
      Info: new FormControl(''),
      GenderName: new FormControl(''),
      DocumentNumber: new FormControl(''),
      BirthDate: new FormControl(''),
      ZipCode: new FormControl(''),
      CreationTime: new FormControl(''),
    },
    );
  }



  client!:Client;

  getClient()
  {
    this.apiService.apiCall(Methods.GET_CLIENT, {ClientId:this.clientId}).pipe(takeUntilDestroyed()).subscribe(data => {
      if(data.ResponseCode === 0)
      {
          this.client = data.ResponseObject;
          this.client.GenderName = this.client.Gender ? "Male" : "Fmail";
          const formData:any = {...this.client};
          this.formGroup.patchValue(formData);
      }
    });
  }

  updateClient()
  {
    this.apiService.apiCall(Methods.EDIT_CLIENT, this.client).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(data => {
      if(data.ResponseCode === 0)
      {
          this.location.back();
      }
    });
  }

  generateCard()
  {

  }

  assignPin()
  {

  }

  resetPassword()
  {

  }

  openWithdrawAmount(account:ClientAccount)
  {
    this.openedAccount = account;
    this.openedWithdraw = true;
    this.openedDeposit = false;
  }

  openDepositAmount(account:ClientAccount)
  {
    this.openedAccount = account;
    this.openedDeposit = true;
    this.openedWithdraw = false;
  }

  payWithdraw()
  {
    if(this.withdrawAmount)
    {
      this.apiService.apiCall(Methods.CREATE_WITHDRAW_PAYMENT_REQUEST, {ClientId: this.clientId, Amount: this.withdrawAmount}).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(data => {
        if(data.ResponseCode === 0)
        {
            const resp = data.ResponseObject;
            this.openedWithdraw = false;
            this.snackBar.open(`${resp.Amount} ${resp.CurrencyId} was succesfull withdrawed`).afterDismissed().subscribe(() => {
              this.printService.printWithdraw(resp);
            });
        }
        else
        {
          this.snackBar.open(data.Description, "", {panelClass:["error-snackbar"]});
        }
      });
    }
  }

  payDeposit()
  {
    if(this.depositAmount)
    {
      this.apiService.apiCall(Methods.DEPOSIT_TO_INTERNET_CLIENT, {ClientId: this.clientId, Amount: this.depositAmount}).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(data => {
        if(data.ResponseCode === 0)
        {
            const resp = data.ResponseObject;
            this.openedDeposit = false;
            this.snackBar.open(`${resp.Amount} ${resp.CurrencyId} was succesfull deposited`).afterDismissed().subscribe(() => {
              //
            });
        }
        else
        {
          this.snackBar.open(data.Description, "", {panelClass:["error-snackbar"]});
        }
      });
    }
  }
}
