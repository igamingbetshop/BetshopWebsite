import {ChangeDetectionStrategy, Component, inject, input, OnInit, signal, WritableSignal} from '@angular/core';
import {ConfigService} from "../../../../core/services/config.service";
import {ControlContainer, FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule, MatLabel} from "@angular/material/form-field";
import {MatSelect} from "@angular/material/select";
import {MatOption} from "@angular/material/autocomplete";
import {getValidatorsFromField} from "../../../../core/utils";
import {Field} from "../../../../core/types";

@Component({
  selector: 'bs-birth-date',
  standalone: true,
  imports: [ReactiveFormsModule,MatFormFieldModule, MatSelect, MatOption, MatLabel],
  templateUrl: './birth-date.component.html',
  styleUrl: './birth-date.component.scss',
  viewProviders:[
    {
      provide:ControlContainer,
      useFactory: () => inject(ControlContainer, {skipSelf:true})
    }
  ]
})
export class BirthDateComponent implements OnInit{
  field = input.required<Field>();
  #config = inject(ConfigService);
  parentContainer = inject(ControlContainer);

  get parentFormGroup(){
    return this.parentContainer.control as FormGroup;
  }

  get isValid(){
    const isValid = this.parentFormGroup.get("BirthYear")?.hasError('required') ||
      this.parentFormGroup.get("BirthMonth")?.hasError('required') ||
      this.parentFormGroup.get("BirthDay")?.hasError('required')
    return isValid;
  }

  #months:string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  years:WritableSignal<number[]> = signal([]);
  months:WritableSignal<{Id:number, Name:string}[]> = signal([]);
  days:WritableSignal<number[]> = signal([]);

  ngOnInit()
  {
    this.initYears();
    const validators = getValidatorsFromField(this.field())
    this.parentFormGroup.addControl("BirthYear", new FormControl("", validators));
    this.parentFormGroup.addControl("BirthMonth", new FormControl("", validators));
    this.parentFormGroup.addControl("BirthDay", new FormControl("", validators));
  }

  changeYear()
  {
    const months:{Id:number, Name:string}[] = [];

    const cMonth = new Date().getMonth();

    for (let i = 0; i < (this.parentFormGroup.get("BirthYear")?.value == this.years()[0] ? cMonth + 1 : this.#months.length); i++)
    {
      months.push({Id: i + 1, Name: this.#months[i]});
    }

    this.months.set(months);
  }

  changeMonth()
  {
    const cDay = new Date().getDate();

    const days:number[] = [];

    const bY = this.parentFormGroup.get("BirthYear")?.value;
    const bM = this.parentFormGroup.get("BirthMonth")?.value;

    const maxCount = new Date(bY, bM, 0).getDate();

    for (let i = 1; i <= ((bM == this.months()[this.months().length - 1].Id && bY == this.years()[0]) ? Math.min(maxCount, cDay) : maxCount); i++)
    {
      days.push(i);
    }

    this.days.set(days);
  }

  private initYears()
  {
    const cYear = new Date().getFullYear();

    const allowAge = this.#config.settings.AllowAge;

    const years = [];

    for (let i = cYear - allowAge; i >= cYear - (100 + allowAge); i--)
    {
      years.push(i);
    }

    this.years.set(years);
  }
}
