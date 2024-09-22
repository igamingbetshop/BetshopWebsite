import {Component, inject, input, OnInit, signal} from '@angular/core';
import {ControlContainer, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {MatInput} from "@angular/material/input";
import {ConfigService} from "../../../../core/services/config.service";
import {getValidatorsFromField} from "../../../../core/utils";
import {Field} from "../../../../core/types";

type Code = {
  Value:string;
  Name:string;
  Country:string;
  Mask:string;
}

@Component({
  selector: 'bs-mobile-number',
  standalone: true,
  imports: [
    FormsModule,
    MatFormField,
    MatLabel,
    MatOption,
    MatSelect,
    ReactiveFormsModule,
    MatError,
    MatInput
  ],
  templateUrl: './mobile-number.component.html',
  styleUrl: './mobile-number.component.scss',
  viewProviders:[
    {
      provide:ControlContainer,
      useFactory: () => inject(ControlContainer, {skipSelf:true})
    }
  ]
})
export class MobileNumberComponent implements OnInit{

  field = input.required<Field>();
  parentContainer = inject(ControlContainer);
  #config = inject(ConfigService);
  get parentFormGroup(){
    return this.parentContainer.control as FormGroup;
  }
  codes = signal<Code[]>(this.#config.settings.MobileCodes.map(code => {
    const c:Code = {
      Value:code.Type,
      Name:code.Title,
      Country:code.StyleType,
      Mask:code.Mask
    }
    return c;
  }) || []);

  ngOnInit()
  {
    const validators = getValidatorsFromField(this.field());
    this.parentFormGroup.addControl("MobileCode", new FormControl("", validators));
    this.parentFormGroup.addControl("MobileNumber", new FormControl("", validators));
  }

}
