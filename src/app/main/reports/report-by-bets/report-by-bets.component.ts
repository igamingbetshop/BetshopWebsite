import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import { ReportFilterComponent } from '../filters/report-filter/report-filter.component';
import { BaseGrid } from 'src/app/shared/components/grid-common/base-grid';
import { ReportFilter } from 'src/app/core/interfaces';
import { Methods } from 'src/app/core/enums';
import {ServerSideStoreType} from 'ag-grid-community';
import { take } from 'rxjs';
import { AgGridModule } from 'ag-grid-angular';
import 'ag-grid-enterprise';
import { paymentStatuses } from 'src/app/core/utils';
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'bs-report-by-bets',
  standalone: true,
  imports: [AgGridModule, ReportFilterComponent],
  templateUrl: './report-by-bets.component.html',
  styleUrls: ['./report-by-bets.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportByBetsComponent extends BaseGrid {

  paginationPage:number = 1;
  cacheBlockSize: number = 10;
  rowModelType:any = 'serverSide';
  serverSideStoreType:ServerSideStoreType = 'full';
  detailData!:any;
  override columnDefs = [
    {
      headerName:$localize`Id`,
      field: 'BetDocumentId',
      cellRenderer: 'agGroupCellRenderer',
    },
    {
      headerName:$localize`Status`,
      field: 'StatusName'
    },
    {
      headerName:$localize`Product`,
      field: 'ProductName'
    },
    {
      headerName:$localize`Bet Amount`,
      field: 'BetAmount'
    },
    {
      headerName:$localize`Win Amount`,
      field: 'WinAmount'
    },
    {
      headerName:$localize`Ticket Number`,
      field: 'TicketNumber'
    },
    {
      headerName:$localize`Bet Date`,
      field: 'BetDate'
    },
    {
      headerName:$localize`Pay Date`,
      field: 'PayDate'
    }
  ];
  detailCellRendererParams: any = {
    detailGridOptions: {
      rowHeight: 47,
      enableCellChangeFlash: true,
      defaultColDef: {
        sortable: true,
        filter: true,
        flex: 1,
      },
      columnDefs: [
        {
          headerName: $localize`Unit Name`,
          field: 'UnitName'
        },
        {
          headerName:$localize`Market Name`,
          field: 'MarketName'
        },
        {
          headerName:$localize`Selection Name`,
          field: 'SelectionName'
        },
        {
          headerName:$localize`Coefficient`,
          field: 'Coefficient'
        },
        {
          headerName:$localize`Event Date`,
          field: 'EventDate'
        }

      ],
    },

    getDetailRowData: (params:any) => {

      const req = {TicketId:params.data.BetDocumentId}
      this.apiService.apiCall(Methods.GET_BET_INFO, req).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0)
        {
          if (params.data._isUpdated != true)
          {
            params.data._isUpdated = true;
            this.detailData = data.ResponseObject;
            this.gridApi!.redrawRows({ rowNodes: [params.node] });
          }
          params.successCallback(data.ResponseObject?.BetSelections);

        }
      });
    },
    refreshStrategy: 'everything',
    template: (params:any) => {
      const data = this.detailData || params.data;
      const isEmpty = !data ? "flex" : "none";
      const hasData = !!data ? "block" : "none";
      const amount = data?.BetAmount ? data.BetAmount.toFixed(2) : '';
      const betDate = data?.BetDate ? data?.BetDate : '';
      const coefficient = data?.Coefficient ? data?.Coefficient : '';
      return `
        <div class="ag-details-row ag-details-row-fixed-height" style="height: 100%">
          <div style="display: ${isEmpty}; height: 10%; color: #000; margin-bottom: 15px; justify-content: center; font-weight: 700; font-size: 24px">No information</div>
          <div style="height: 100%; display: ${hasData}">
            <div style="font-weight: 700; font-size: 24px; margin-bottom: 8px">Information</div>
            <div style="height: 10%; font-size: 16px; color: #076192">Amount: ${amount}</div>
            <div style="height: 10%; font-size: 16px; color: #076192">Bet Date: ${betDate}</div>
            <div style="height: 10%; font-size: 16px; color: #076192">Coefficient: ${coefficient}</div>
            <div style="height: 100%;">
              <div style="height: 10%; color: #000; margin-bottom: 15px; display: flex; justify-content: center; font-weight: 700; font-size: 24px">Selections</div>
              <div ref="eDetailGrid" class="ag-details-grid ag-details-grid-fixed-height"></div>
            </div
          </div>
        </div>`
    }
  };
  private snackBar = inject(MatSnackBar);

  override getData(filter:ReportFilter)
  {
    this.gridApi!.setServerSideDatasource(this.createServerSideDatasource(filter));
  }

  createServerSideDatasource(filter:ReportFilter) {
    return {
      getRows: (params:any) => {

        filter.SkipCount = this.paginationPage - 1;
        filter.TakeCount = Number(this.cacheBlockSize);

        this.apiService.apiCall(Methods.GET_BET_SHOP_BETS, filter).pipe(take(1)).subscribe(data => {
          if(data.ResponseCode === 0)
          {
              const totals = {betAmount:0, winAmount:0, pays:0, tickets:0};
              const rows = data.ResponseObject.Bets.map((bet:any) => {
                if(bet.State !== 4)
                {
                  totals.betAmount += bet.BetAmount;
                  totals.winAmount += bet.WinAmount;

                  if(bet.State === 5)
                  {
                    totals.pays += bet.WinAmount;
                    totals.tickets++
                  }
                }
                bet.StatusName = paymentStatuses[bet.State];
                return bet;
              });
              this.gridApi!.setPinnedBottomRowData([{
                BetAmount: totals.betAmount,
                WinAmount: totals.winAmount,
              }
            ]);
            params.success({rowData: rows, rowCount: data.ResponseObject.Count});
          }
          else
          {
            this.snackBar.open(data.Description, "", {panelClass:["error-snackbar"]});
          }
        });
      },
    };
  }

  onRowGroupOpened(params:any) {
    if (params.node.expanded) {
      this.gridApi.forEachNode(function (node) {
        if (
          node.expanded &&
          node.id !== params.node.id &&
          node.uiLevel === params.node.uiLevel
        ) {
          node.setExpanded(false);
        }
      });
    }
  }
}
