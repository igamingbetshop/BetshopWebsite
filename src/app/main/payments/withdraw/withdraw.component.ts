import { ChangeDetectionStrategy, Component, WritableSignal, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from 'src/app/core/services/api.service';
import { Methods } from 'src/app/core/enums';
import { take } from 'rxjs';
import { WithdrawClient } from 'src/app/core/classes/withdraw-client';

@Component({
  selector: 'bs-withdraw',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatSnackBarModule, FormsModule, ReactiveFormsModule],
  templateUrl: './withdraw.component.html',
  styleUrl: './withdraw.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WithdrawComponent {

  client:WritableSignal<WithdrawClient | any> = signal(false);
  paymentRequests:WritableSignal<any[]> = signal([]);
  private filterErrorMessage = $localize `Please fill any field`;
  filterForm = new FormGroup({
    ClientId: new FormControl<number | null>(null),
    DocumentNumber: new FormControl<string | null>(null),
    Barcode: new FormControl<string | null>(null),
    CashCode: new FormControl<string | null>(null),
  });

  private apiService = inject(ApiService);
  private snackBar = inject(MatSnackBar);

  search()
  {
    if(this.filterForm.get("ClientId")?.value || this.filterForm.get("CashCode")?.value ||
     this.filterForm.get("DocumentNumber")?.value || this.filterForm.get("Barcode")?.value)
     {
      this.apiService.apiCall(Methods.GET_PAYMENT_REQUESTS, this.filterForm.getRawValue()).pipe(take(1)).subscribe(data => {
        if(data.ResponseCode === 0)
        {
          const requests = data.ResponseObject.PaymentRequests;

          if(requests.length)
          {
            const client = new WithdrawClient();
            client.ClientId = requests[0].ClientId;
            client.ClientFirstName = requests[0].ClientFirstName;
            client.ClientLastName = requests[0].ClientLastName;
            client.UserName = requests[0].UserName;
            client.ClientEmail = requests[0].ClientEmail;
            client.DocumentNumber = requests[0].DocumentNumber;
            this.paymentRequests.set(requests);
            this.client.set(client);
          }
          else
            this.client.set(null);
        }
        else
        {
          this.snackBar.open(data.Description, "", {panelClass:["error-snackbar"]});
        }
      });
     }
     else
     {
      this.snackBar.open(this.filterErrorMessage, "", {panelClass:["error-snackbar"]});
     }

  }

  pay(request:any)
  {
    this.apiService.apiCall(Methods.PAY_PAYMENT_REQUEST, {PaymentRequestId:request.Id, Comment:""}).pipe(take(1)).subscribe(data => {
      if(data.ResponseCode === 0)
      {
        this.snackBar.open("Success", "").afterDismissed().subscribe(data => {
          this.search();
        });
      }
      else  this.snackBar.open(data.Description, "", {panelClass:["error-snackbar"]});
    });
  }

}
