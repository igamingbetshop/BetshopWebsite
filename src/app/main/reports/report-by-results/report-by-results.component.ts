import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular';
import 'ag-grid-enterprise';
import { ReportFilterComponent } from '../filters/report-filter/report-filter.component';
import { ReportFilter } from 'src/app/core/interfaces';
import { BaseGrid } from 'src/app/shared/components/grid-common/base-grid';
import { Methods } from 'src/app/core/enums';
import { take } from 'rxjs';
import { ServerSideStoreType } from 'ag-grid-community';

@Component({
  selector: 'bs-report-by-results',
  standalone: true,
  imports: [AgGridModule, ReportFilterComponent],
  templateUrl: './report-by-results.component.html',
  styleUrls: ['./report-by-results.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportByResultsComponent extends BaseGrid {

  paginationPage:number = 1;
  cacheBlockSize: number = 10;
  rowModelType:any = 'serverSide';
  serverSideStoreType:ServerSideStoreType = 'full';
  override columnDefs = [
    {
      headerName:$localize`Id`,
      field: 'Id'
    },
    {
      headerName:$localize`UnitId`,
      field: 'UnitId'
    },
    {
      headerName:$localize`RoundId`,
      field: 'RoundId'
    },
    {
      headerName:$localize`Game name`,
      field: 'GameName'
    },
    {
      headerName:$localize`Status`,
      field: 'Status'
    },
    {
      headerName:$localize`Date`,
      field: 'CreationDate'
    }
  ];

  override getData(filter:ReportFilter)
  {
    if(filter.GameId)
      this.gridApi!.setServerSideDatasource(this.createServerSideDatasource(filter));
  }

  createServerSideDatasource(filter:ReportFilter) {
    return {
      getRows: (params:any) => {

        filter.SkipCount = this.paginationPage - 1;
        filter.TakeCount = Number(this.cacheBlockSize);

        this.apiService.apiCall(Methods.GET_RESULT_REPORT, filter).pipe(take(1)).subscribe(data => {
          if(data.ResponseCode === 0)
          {
            const rows = data.ResponseObject.Entities;
            this.rowData.set(data.ResponseObject.Entities);
            params.success({rowData: rows, rowCount: data.ResponseObject.Count});
          }
        });
      },
    };
  }
}
