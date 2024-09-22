import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular';
import { ReportFilterComponent } from '../filters/report-filter/report-filter.component';
import { ReportFilter } from 'src/app/core/interfaces';
import { BaseGrid } from 'src/app/shared/components/grid-common/base-grid';
import { Methods } from 'src/app/core/enums';
import { take } from 'rxjs';

@Component({
  selector: 'bs-report-by-transactions',
  standalone: true,
  imports: [AgGridModule, ReportFilterComponent],
  templateUrl: './report-by-transactions.component.html',
  styleUrls: ['./report-by-transactions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportByTransactionsComponent extends BaseGrid {

  override columnDefs = [
    {
      headerName:$localize`Id`,
      field: 'Id'
    },
    {
      headerName:$localize`Client Id`,
      field: 'ClientId'
    },
    {
      headerName:$localize`Payment Request Id`,
      field: 'PaymentRequestId'
    },
    {
      headerName:$localize`Operation type`,
      field: 'OperationTypeName'
    },
    {
      headerName:$localize`Amount`,
      field: 'Amount'
    },
    {
      headerName:$localize`Date`,
      field: 'CreationTime'
    },
  ]
  override getData(filter:ReportFilter)
  {
    const copyFilter = {...filter};

    if(!copyFilter.FilterBy || copyFilter.FilterBy === 'date')
    {
      delete copyFilter.LastShiftsNumber;
    }
    else if(copyFilter.FilterBy === 'shift')
    {
      delete copyFilter.FromDate;
      delete copyFilter.ToDate;
    }
    this.apiService.apiCall(Methods.GET_CASH_DESK_OPERATIONS, copyFilter).pipe(take(1)).subscribe(data => {
      if(data.ResponseCode === 0)
      {
        this.rowData.set(data.ResponseObject.Operations.map((operation:any) => {
          operation.Amount = `${operation.Amount} ${operation.CurrencyId}`;
          return operation;
        }));
      }
    });
  }

}
