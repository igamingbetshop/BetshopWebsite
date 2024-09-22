import { ChangeDetectionStrategy, Component, OnInit, WritableSignal, signal } from '@angular/core';
import { NgFor } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { matchValidator } from 'src/app/core/validators';
import { ApiService } from 'src/app/core/services/api.service';
import { ConfigService } from 'src/app/core/services/config.service';
import { take } from 'rxjs';
import { Methods } from 'src/app/core/enums';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {MatCheckbox, MatCheckboxModule} from '@angular/material/checkbox';
import {MatError, MatFormFieldModule, MatLabel} from '@angular/material/form-field';
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {BirthDateComponent} from "./birth-date/birth-date.component";
import {MatSelect} from "@angular/material/select";
import {MatOption} from "@angular/material/autocomplete";
import {MobileNumberComponent} from "./mobile-number/mobile-number.component";
import {getValidatorsFromField} from "../../../core/utils";
import {Field} from "../../../core/types";
import {RegionComponent} from "./region/region.component";

@Component({
  selector: 'bs-register-client',
  standalone: true,
  imports: [NgFor, ReactiveFormsModule, MatSnackBarModule,
    MatCheckboxModule, MatFormFieldModule, FormsModule, MatInput,
    MatError, MatButton, BirthDateComponent,  MatSelect,
    MatOption, MatLabel, MobileNumberComponent, RegionComponent, MatCheckbox],
  templateUrl: './register-client.component.html',
  styleUrls: ['./register-client.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterClientComponent implements OnInit {

  formGroup!:FormGroup;

  paymentSystems:WritableSignal<any[]> = signal(this.apiService.authService.getCashier
    .PaymentSystems.map(payment => {
    payment.Selected = false;
    return payment;
  }));
  errorText:WritableSignal<string> = signal("");
  fields = signal<Field[]>([]);

  constructor(
    private apiService:ApiService,
    private config:ConfigService,
    private _snackBar: MatSnackBar){}

  ngOnInit(): void
  {
    this.getRegistrationFields();
    this.formGroup = new FormGroup({});
  }

  submit()
  {
    if(this.formGroup.valid)
    {
      const req = this.formGroup.getRawValue();
      req.BetShopPaymentSystems = this.paymentSystems().filter(payment => payment.Selected).map(payment => payment.Id);
      this.apiService.apiCall(Methods.REGISTER_CLIENT, req).pipe(take(1)).subscribe(data => {
        if(data.ResponseCode !== 0)
        {
          this.errorText.set(data.Description);
          const p = setTimeout(() => {
            this.errorText.set("");
            clearTimeout(p);
          }, 3000);
        }
        else
        {
          this._snackBar.open("Client successfully registered");
        }
      });
    }
    else this.formGroup.markAllAsTouched()
  }

  getRegistrationFields()
  {
    this.apiService.apiCall(Methods.GET_REGISTER_FIELDS).pipe(take(1)).subscribe(data => {
        if(data.ResponseCode === 0)
        {
          this.fields.set(data.ResponseObject.map((field:any) => {
            const f:Field = {
              Title:field.Title,
              Type:field.Type,
              Order:field.Order,
              Config:field.Href ? JSON.parse(field.Href) : {}
            }
            return f;
          }));
          this.#createForm();
        }
    });
  }

  #createForm()
  {
    const commonTypes = ["text", "gender", "checkbox"];
    this.fields().forEach(field => {
      const validators = getValidatorsFromField(field);

      if(commonTypes.includes(field.Type))
      {
        this.formGroup.addControl(field.Title, new FormControl("", validators));
      }
      else if(field.Type === "password")
      {
        this.formGroup.addControl("Password", new FormControl("", validators));
        this.formGroup.addControl("ConfirmPassword", new FormControl("", validators));
        this.formGroup.addValidators(matchValidator("ConfirmPassword", "Password"));
      }
    });
  }

}
