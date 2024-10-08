import {ChangeDetectionStrategy, Component, inject, input, OnInit, signal, WritableSignal} from '@angular/core';
import {ControlContainer, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {getValidatorsFromField} from "../../../../core/utils";
import {Methods, Regions} from "../../../../core/enums";
import {take} from "rxjs";
import {ApiService} from "../../../../core/services/api.service";
import {Region} from "../../../../core/interfaces";
import {Field} from "../../../../core/types";

@Component({
  selector: 'bs-region',
  standalone: true,
    imports: [
        FormsModule,
        MatFormField,
        MatLabel,
        MatOption,
        MatSelect,
        ReactiveFormsModule
    ],
  templateUrl: './region.component.html',
  styleUrl: './region.component.scss',
  viewProviders:[
    {
      provide:ControlContainer,
      useFactory: () => inject(ControlContainer, {skipSelf:true})
    }
  ]
})
export class RegionComponent implements OnInit{
  field = input.required<Field>();
  type = input<'city' | 'district' | ''>("");
  parentContainer = inject(ControlContainer);
  countries:WritableSignal<Region[]> = signal([]);
  cities:WritableSignal<Region[]> = signal([]);
  #apiService = inject(ApiService);
  get parentFormGroup(){
    return this.parentContainer.control as FormGroup;
  }

  ngOnInit()
  {
    this.getRegions({TypeId:Regions.COUNTRY});
    this.parentFormGroup.addControl(this.field().Title, new FormControl("", getValidatorsFromField(this.field())));
    if(this.type() === 'city')
      this.parentFormGroup.addControl("City", new FormControl("", getValidatorsFromField(this.field())));

  }

  getRegions(filter:any)
  {
    this.#apiService.apiCall(Methods.GET_REGIONS, filter).pipe(take(1)).subscribe(data => {
      if(data.ResponseCode === 0)
      {
        if(filter.TypeId === Regions.CITY && this.type() === 'city')
        {
          this.cities.set(data.ResponseObject.Entities);
        }
        else if(filter.TypeId === Regions.COUNTRY)
        {
          this.countries.set(data.ResponseObject.Entities);
        }
      }
    });
  }

}
