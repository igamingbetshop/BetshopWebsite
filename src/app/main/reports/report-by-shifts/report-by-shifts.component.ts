import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Methods } from 'src/app/core/enums';
import { AgGridModule } from 'ag-grid-angular';
import { take } from 'rxjs';
import { ReportFilterComponent } from '../filters/report-filter/report-filter.component';
import { ReportFilter } from 'src/app/core/interfaces';
import { BaseGrid } from 'src/app/shared/components/grid-common/base-grid';

@Component({
  selector: 'bs-report-by-shifts',
  standalone: true,
  imports: [AgGridModule, ReportFilterComponent],
  templateUrl: './report-by-shifts.component.html',
  styleUrls: ['./report-by-shifts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportByShiftsComponent extends BaseGrid {


   override columnDefs = [
    {
      headerName:$localize`Report Number`,
      field: 'Id'
    },
    {
      headerName:$localize`Betshop`,
      field: 'Betshop'
    },
    {
      headerName:$localize`Cashier`,
      field: 'Cashier'
    },
    {
      headerName:$localize`End Amount`,
      field: 'EndAmount'
    },
    {
      headerName:$localize`Total Bets`,
      field: 'BetAmounts'
    },
    {
      headerName:$localize`Total Pay`,
      field: 'PayedWins'
    },
    {
      headerName:$localize`Deposit to client`,
      field: 'DepositToInternetClients'
    },
    {
      headerName:$localize`Withdraw to client`,
      field: 'WithdrawFromInternetClients'
    },
    {
      headerName:$localize`Other income`,
      field: 'DebitCorrectionOnCashDesk'
    },
    {
      headerName:$localize`Other outcome`,
      field: 'CreditCorrectionOnCashDesk'
    },
    {
      headerName:$localize`Start date`,
      field: 'StartTime'
    },
    {
      headerName:$localize`End date`,
      field: 'EndTime'
    }
  ];

  override getData(filter:ReportFilter)
  {
    this.apiService.apiCall(Methods.GET_SHIFT_REPORT, filter).pipe(take(1)).subscribe(data => {
      if(data.ResponseCode === 0)
      {
        this.rowData.set(data.ResponseObject.Shifts.map((shift:any) => {
          shift.Cashier = `${shift.CashierFirstName} ${shift.CashierLastName}`;
          shift.Cashier = `${shift.CashierFirstName} ${shift.CashierLastName}`;
          shift.Betshop = `${shift.BetShopAddress} ${shift.BetShopId}`;
          return shift;
        }));
      }
    });
  }
}
