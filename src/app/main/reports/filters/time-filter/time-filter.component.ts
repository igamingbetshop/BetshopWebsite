import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  inject,
  input,
  WritableSignal,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { ReportFilterService } from '../report-filter.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {getDefaultRange} from "../../../../core/utils";
import {MaxRangeDirective} from "./max-range.directive";
import {NavigationEnd, Router} from "@angular/router";
import {filter} from "rxjs";

@Component({
  selector: 'bs-time-filter',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule,
    MatDatepickerModule, MatFormFieldModule, MatNativeDateModule, MaxRangeDirective],
  templateUrl: './time-filter.component.html',
  styleUrl: './time-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation:ViewEncapsulation.None
})
export class TimeFilterComponent {

  router = inject(Router);
  reportService = inject(ReportFilterService);

  defaultRange = getDefaultRange();

  rangeLimit:WritableSignal<number> = signal(0);

  minDate: Date | undefined;
  maxDate: Date | undefined;

  range = new FormGroup({
    FromDate: new FormControl<Date | null>(null, Validators.required),
    ToDate: new FormControl<Date | null>(null, Validators.required),
  });

  constructor()
  {
    this.range.valueChanges.pipe(takeUntilDestroyed()).subscribe((data:any) => {
      this.reportService.update({...data, FromDate:data.FromDate?.toLocaleString(), ToDate:data.ToDate?.toLocaleString()});
    });
    this.range.setValue({FromDate:this.defaultRange.FromDate, ToDate:this.defaultRange.ToDate});

    this.router.events.pipe(takeUntilDestroyed(), filter(event => event instanceof NavigationEnd)).subscribe(event => {
        this.setDateRange((event as NavigationEnd).url);
    });
    //this.setDateRange(this.router.url);
    this.setDateRangeConstraints(this.router.url);
  }

  private setDateRangeConstraints(type:string)
  {
    switch (type)
    {
      case "/reports/report-by-bets":
        const d = new Date();
        d.setDate(d.getDate() - 6);
        this.minDate = d;
        this.maxDate = new Date();
        break;
    }
  }

  private setDateRange(type:string)
  {
    switch (type)
    {
      case "/reports/report-by-bets":
        this.rangeLimit.set(7);
        break;
      default:
        this.rangeLimit.set(30);
    }
  }
}
