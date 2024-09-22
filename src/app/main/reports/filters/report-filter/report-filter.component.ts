import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  Output,
  inject,
  input
} from '@angular/core';
import { TimeFilterComponent } from '../time-filter/time-filter.component';
import { ReportFilterService } from '../report-filter.service';
import { ReportFilter, Shift } from 'src/app/core/interfaces';
import { MatButtonModule } from '@angular/material/button';
import { BetsFilterComponent } from '../bets-filter/bets-filter.component';
import { PaymentsFilterComponent } from '../payments-filter/payments-filter.component';
import { TransactionsFilterComponent } from '../transactions-filter/transactions-filter.component';
import { ResultsFilterComponent } from '../results-filter/results-filter.component';
import { ApiService } from 'src/app/core/services/api.service';
import { Methods } from 'src/app/core/enums';
import { PrintService } from 'src/app/core/services/print.service';
import { MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import { timer } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'bs-report-filter',
  standalone: true,
  imports: [TimeFilterComponent, MatButtonModule,
      BetsFilterComponent, PaymentsFilterComponent,
      TransactionsFilterComponent,
      MatSnackBarModule, ResultsFilterComponent],

  templateUrl: './report-filter.component.html',
  styleUrl: './report-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportFilterComponent {

  reportService = inject(ReportFilterService);
  private apiService = inject(ApiService);
  private printService = inject(PrintService);
  private snackBar = inject(MatSnackBar);
  private authService = inject(AuthService);

  type = input.required<string>();
  @Output() onFilter:EventEmitter<ReportFilter> = new EventEmitter();

  search(){this.onFilter.next(this.reportService.filter())}

  destroyRef = inject(DestroyRef).onDestroy(() => {
    this.reportService.reset();
  });

  closeShift()
  {
    this.apiService.apiCall(Methods.CLOSE_SHIFT, {}).subscribe(data => {
       if(data.ResponseCode === 0)
       {
          const shift:Shift = data.ResponseObject;
          this.printService.printShiftTicket(shift);
          timer(0, 1000).subscribe(data => this.authService.logout());
       }
       else
       {
        this.snackBar.open(data.Description, "", {panelClass:["error-snackbar"]});
       }
    });
  }
}
