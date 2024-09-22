import { Injectable, WritableSignal, signal, effect } from '@angular/core';
import { ReportFilter } from 'src/app/core/interfaces';

@Injectable()
export class ReportFilterService {

  default:ReportFilter = {
    FromDate:null,
    ToDate:null,
    Barcode:"",
    FilterBy:"",
    LastShiftsNumber:null,
    ProductId:null,
    State:null,
    GameId:null
   }
  filter:WritableSignal<ReportFilter> = signal(this.default);

  constructor()
  {
    effect(() => {
      console.log("filter changed");
    });
  }

  update(data:any)
  {
    this.filter.update(filter => ({...filter, ...data}));
  }

  reset()
  {
    this.filter.set(this.default);
  }
}
