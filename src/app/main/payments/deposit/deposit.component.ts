import { MatFormFieldModule } from '@angular/material/form-field';
import { ChangeDetectionStrategy, Component, WritableSignal, inject, signal } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from 'src/app/core/services/api.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Methods } from 'src/app/core/enums';
import { take } from 'rxjs';
import { Client } from 'src/app/core/interfaces';

@Component({
  selector: 'bs-deposit',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatSnackBarModule, FormsModule, ReactiveFormsModule],
  templateUrl: './deposit.component.html',
  styleUrl: './deposit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DepositComponent {

  client:WritableSignal<Client | any> = signal(null);
  private apiService = inject(ApiService);
  private snackBar = inject(MatSnackBar);
  private filterErrorMessage = $localize `Please fill any field`;

  filterForm = new FormGroup({
    ClientId: new FormControl<number | null>(null),
    UserName: new FormControl<string | null>(null),
    DocumentNumber: new FormControl<string | null>(null),
    Email: new FormControl<string | null>(null),
  });

  depositForm = new FormGroup({
    Amount: new FormControl<number | null>(null, Validators.required)
  });

  submit()
  {
    if(this.filterForm.get("ClientId")?.value || this.filterForm.get("UserName")?.value ||
     this.filterForm.get("DocumentNumber")?.value || this.filterForm.get("Email")?.value)
    {
      this.apiService.apiCall(Methods.GET_CLIENT, this.filterForm.getRawValue()).pipe(take(1)).subscribe(data => {
        if(data.ResponseCode === 0)
        {
          const client:Client = data.ResponseObject;

          if(client.Settings)
            this.mapSettings(client);

           this.client.set(client);
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

  deposit()
  {
    this.apiService.apiCall(Methods.DEPOSIT_TO_INTERNET_CLIENT, {...this.depositForm.getRawValue(), ...{ClientId:this.client().Id}}).pipe(take(1)).subscribe(data => {
      if(data.ResponseCode === 0)
      {
         const deposit = data.ResponseObject;
         const message = $localize`${deposit.Amount} ${deposit.CurrencyId} was succesfull deposited`;
         this.snackBar.open(message, "");
      }
      else
      {
        this.snackBar.open(data.Description, "", {panelClass:["error-snackbar"]});
      }
    });
  }

  mapSettings(client:Client)
  {
    if(client.Settings.BlockedForInactivity?.StringValue)
      client.Settings.BlockedForInactivity.StringValue = parseInt(client.Settings.BlockedForInactivity.StringValue);
		if(client.Settings.SystemExcluded?.StringValue)
			client.Settings.SystemExcluded.StringValue = parseInt(client.Settings.SystemExcluded.StringValue);
		if(client.Settings.SelfExcluded?.StringValue)
			client.Settings.SelfExcluded.StringValue = parseInt(client.Settings.SelfExcluded.StringValue);
		if(client.Settings.Excluded?.StringValue)
			client.Settings.Excluded.StringValue = parseInt(client.Settings.Excluded.StringValue);

		if(!client.Settings.DocumentVerified?.StringValue)
			client.StatusName = $localize `Document verification status message`;
		else if(client.Settings.Younger?.StringValue == 1)
      client.StatusName = $localize `Younger verification status message`;
		else if(client.Settings.AMLVerified?.StringValue == 1 && client.Settings.AMLProhibited.StringValue == 2)
      client.StatusName = $localize `AML verification status message`;
		else if(client.Settings.JCJProhibited?.StringValue == 1)
      client.StatusName = $localize `JCJ excluded status message`;
		else if(client.Settings.SelfExcluded?.StringValue == 1)
      client.StatusName = $localize `Self excluded status message`;
		else if(client.Settings.Excluded?.StringValue == 1)
      client.StatusName = $localize `Fully blocked status message`;
		else if(client.Settings.CautionSuspension?.StringValue == 1)
      client.StatusName = $localize `Caution suspension status message`;
		else if(client.Settings.SystemExcluded?.StringValue == 1)
      client.StatusName = $localize `System excluded status message`;
		else if(client.Settings.DocumentExpired?.StringValue == 1)
      client.StatusName = $localize `Document expired status message`;
		else if(client.Settings.TermsConditionsAcceptanceVersion?.DecimalValue == 1)
      client.StatusName = $localize `Terms and condition excluded status message`;
		else if(client.Settings.BlockedForInactivity?.DecimalValue == 1)
      client.StatusName = $localize `Block for inactivity status message`;
		else
      client.StatusName = $localize `Default status message`;

		let isDeposit =
    client.Settings.AMLProhibited?.StringValue != 2 && !client.Settings.JCJProhibited?.StringValue &&
    client.Settings.AMLVerified?.StringValue !== 0 && !client.Settings.BlockedForInactivity?.StringValue &&
    !client.Settings.DocumentExpired?.StringValue && !client.Settings.SelfExcluded?.StringValue &&
    !client.Settings.Younger?.StringValue && !client.Settings.Excluded?.StringValue &&
    !client.Settings.SystemExcluded?.StringValue && !client.Settings.CautionSuspension?.StringValue &&
    !!client.Settings.DocumentVerified?.StringValue &&
    !!client.Settings.TermsConditionsAcceptanceVersion?.StringValue;

	   client.Allowed = isDeposit ? $localize `Yes` :  $localize `No`;
  }

}
