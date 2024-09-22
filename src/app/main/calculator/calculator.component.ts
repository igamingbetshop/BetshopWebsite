import {ChangeDetectionStrategy, Component, inject, input, signal, ViewChild, WritableSignal} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {MAT_DIALOG_DATA, MatDialogClose} from "@angular/material/dialog";
import {AgGridAngular, AgGridModule} from "ag-grid-angular";
import 'ag-grid-enterprise';
import {Methods} from "../../core/enums";
import {take} from "rxjs";
import {getDefaultRange} from "../../core/utils";
import {ColDef, GridApi, GridReadyEvent} from "ag-grid-community";
import {ApiService} from "../../core/services/api.service";
import {AuthService} from "../../core/services/auth.service";


@Component({
  selector: 'bs-calculator',
  standalone: true,
  imports: [
    MatIcon,
    MatIconButton,
    MatDialogClose,
    AgGridModule
  ],
  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host:{class:"calculator"}
})
export class CalculatorComponent {

  @ViewChild('gridHref') grid!: AgGridAngular;
  dialogData:any = inject(MAT_DIALOG_DATA, {optional:true});
  apiService = inject(ApiService);
  authService = inject(AuthService);
  paginationPage:number = 1;
  cacheBlockSize: number = 10;
  rowModelType:any = 'serverSide';
  defaultColDef: ColDef = {flex:1};
  rowData:WritableSignal<any[]> = signal([]);
  gridApi!: GridApi<any>;
  defaultRange = getDefaultRange(2);
  filter = {
    FromDate:this.defaultRange.FromDate,
    ToDate:this.defaultRange.ToDate,
    SkipCount:0,
    TakeCount:100
  }
  totals:WritableSignal<any> = signal({betAmount:0,winAmount:0,pays:0});

  columnDefs = [
    {
      headerName:$localize`Date`,
      field: 'BetDate'
    },
    {
      headerName:$localize`Transactions`,
      field: 'Name',
    },

    {
      headerName:$localize`Amount`,
      field: 'BetAmount'
    }
  ];
  currency:string = this.authService.getCashier.BetShopCurrencyId;
  onGridReady(params: GridReadyEvent)
  {
    this.gridApi! = params.api;
    this.getData(this.filter);
  }

  getData(filter:any)
  {
    this.gridApi!.setServerSideDatasource(this.createServerSideDatasource(filter));
  }

  createServerSideDatasource(filter:any) {
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
              bet.Name = `${bet.ProductName} ${bet.BetDocumentId}`
              return bet;
            });
            this.totals.set(totals);
            params.success({rowData: rows, rowCount: data.ResponseObject.Count});
          }
        });
      },
    };
  }

  printData()
  {
    //createPdf(this.grid.).download("data.pdf");
    this.gridApi!.exportDataAsCsv();
  }
}
