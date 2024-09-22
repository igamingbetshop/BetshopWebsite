import { ChangeDetectionStrategy, Component, WritableSignal, signal } from '@angular/core';
import { ReportFilterComponent } from '../filters/report-filter/report-filter.component';
import { ReportFilter } from 'src/app/core/interfaces';
import { AgGridModule } from 'ag-grid-angular';
import { take } from 'rxjs';
import { Methods } from 'src/app/core/enums';
import { BaseGrid } from 'src/app/shared/components/grid-common/base-grid';

@Component({
  selector: 'bs-report-by-payments',
  standalone: true,
  imports: [AgGridModule, ReportFilterComponent],
  templateUrl: './report-by-payments.component.html',
  styleUrls: ['./report-by-payments.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportByPaymentsComponent extends BaseGrid {

  override columnDefs = [
    {
      headerName:$localize`Id`,
      field: 'Id'
    },
    {
      headerName:$localize`ClientId`,
      field: 'ClientId'
    },
    {
      headerName:$localize`UserName`,
      field: 'UserName'
    },
    {
      headerName:$localize`Name`,
      field: 'Name'
    },
    {
      headerName:$localize`Email`,
      field: 'Email'
    },
    {
      headerName:$localize`Amount`,
      field: 'Amount'
    },
    {
      headerName:$localize`Type`,
      field: 'Type'
    },
    {
      headerName:$localize`Creation time`,
      field: 'CreationTime'
    },
    {
      headerName:$localize`Last update time`,
      field: 'LastUpdateTime'
    }
  ];

  override getData(filter:ReportFilter)
  {
    this.apiService.apiCall(Methods.GET_BET_SHOP_OPERATIONS, filter).pipe(take(1)).subscribe(data => {
      if(data.ResponseCode === 0)
      {
        this.rowData.set(data.ResponseObject.Operations.map((payment:any) => {
          payment.Name = `${payment.CashierFirstName} ${payment.CashierLastName}`;
          payment.Amount = `${payment.Amount} ${payment.CurrencyId}`;
          payment.Type = payment.Type === 1 ? "Withdraw" : "Deposit";
          return payment;
        }));
      }
    });
  }

}
