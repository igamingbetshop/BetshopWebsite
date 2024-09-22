import { TranslateModule } from '@ngx-translate/core';
import { TicketInfo } from './../../core/interfaces/ticket-info';
import { Methods } from 'src/app/core/enums';
import { ChangeDetectionStrategy, Component, inject, LOCALE_ID, signal, WritableSignal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/core/services/api.service';
import { take } from 'rxjs';
import { formatDate } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatRadioModule } from '@angular/material/radio';
import { paymentStatuses } from 'src/app/core/utils';
import {CashOut} from "../../core/interfaces/cash-out";

@Component({
  selector: 'bs-ticket-validation',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule,
     MatButtonModule, MatIconModule, MatDialogClose, MatSnackBarModule, MatRadioModule,
      TranslateModule],
  templateUrl: './ticket-validation.component.html',
  styleUrl: './ticket-validation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TicketValidationComponent {

  barcode:WritableSignal<string> = signal("");
  acceptMode:WritableSignal<string> = signal("3");
  ticketInfo:WritableSignal<TicketInfo> = signal({Data:false, Submitted:false});
  private locale = inject(LOCALE_ID);
  private snackBar = inject(MatSnackBar);
  private dialogRef = inject(MatDialogRef);

  private apiService = inject(ApiService);

  cashOut()
  {
    const cashOut:CashOut = {BetDocumentId:this.ticketInfo().Data.BetDocumentId, IsFullAmount:true};
    this.apiService.apiCall(Methods.CASH_OUT, cashOut).pipe(take(1)).subscribe(data => {
      if(data.ResponseCode === 0)
      {
        this.snackBar.open($localize `Cash Out is successful`).afterDismissed().subscribe(() => {
          this.dialogRef.close();
        });
      }
      else
      {
        this.snackBar.open(data.Description, "", {panelClass:["error-snackbar"]});
      }
    });
  }

  search()
  {
    this.apiService.apiCall(Methods.GET_BET_BY_BARCODE, {Barcode:this.barcode()}).pipe(take(1)).subscribe(data => {
        if(data.ResponseCode === 0)
        {
          const resp = data.ResponseObject;
          resp.BetDate = formatDate(resp.BetDate, 'dd-MM-yyyy', this.locale);
          resp.StateName = paymentStatuses[resp.State];
          this.ticketInfo.set({Data:data.ResponseObject, Submitted:true});
        }
        else this.ticketInfo.update(current => ({...current, Submitted:true}));
    });
  }

  pay()
  {
    this.apiService.apiCall(Methods.PLACE_BET_BY_BARCODE, {Barcode:this.ticketInfo().Data.Barcode, AcceptType:this.acceptMode()}).pipe(take(1)).subscribe(data => {
      if(data.ResponseCode === 0)
      {
        this.snackBar.open($localize `Client successfully registered`).afterDismissed().subscribe(() => {
          this.dialogRef.close();
        });
      }
      else
      {
        this.snackBar.open(data.Description, "", {panelClass:["error-snackbar"]});
      }
  });
  }
}
