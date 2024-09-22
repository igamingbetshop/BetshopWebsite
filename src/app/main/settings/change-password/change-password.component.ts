import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from 'src/app/core/services/api.service';
import { Methods } from 'src/app/core/enums';
import { matchValidator } from 'src/app/core/validators';
import { take } from 'rxjs';
import {MatFormField, MatFormFieldModule} from "@angular/material/form-field";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {MatInputModule} from "@angular/material/input";

@Component({
  selector: 'bs-change-password',
  standalone: true,
    imports: [CommonModule, ReactiveFormsModule, MatSnackBarModule, MatFormFieldModule, MatInputModule],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangePasswordComponent implements OnInit {

  formGroup!:FormGroup;
  errorText = signal("");

  constructor(private apiService:ApiService, private _snackBar: MatSnackBar){}

  ngOnInit(): void
  {
    this.formGroup = new FormGroup({
      OldPassword: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)]),
      NewPassword: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)]),
      ConfirmPassword: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)]),
    },
    {
      validators:matchValidator("NewPassword", "ConfirmPassword")
    });
    this.formGroup.events.subscribe(data => {

    });
  }

  submit()
  {
    if(this.formGroup.valid)
    {
      const formData = this.formGroup.getRawValue();

      this.apiService.apiCall(Methods.CHANGE_CASHIER_PASSWORD, formData).pipe(take(1)).subscribe(resp => {
          if(resp.ResponseCode !== 0)
          {
            this.errorText.set(resp.Description);
          }
          else
          {
            this._snackBar.open("Password has been successfully changed");
          }
      });
    }
  }
  get currentPassword() {
    return this.formGroup.get('OldPassword');
  }
  get newPassword() {
    return this.formGroup.get('NewPassword');
  }
  get confirmPassword() {
    return this.formGroup.get('ConfirmPassword');
  }

}
