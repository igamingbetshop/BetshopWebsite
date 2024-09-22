import { AuthService } from 'src/app/core/services/auth.service';
import { ChangeDetectionStrategy, Component, WritableSignal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ApiService } from 'src/app/core/services/api.service';
import { Methods } from 'src/app/core/enums';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'bs-cashdesks',
  standalone: true,
  imports: [CommonModule, AgGridModule],
  templateUrl: './cashdesks.component.html',
  styleUrls: ['./cashdesks.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CashdesksComponent {

  rowData:WritableSignal<any[]> = signal([]);
  private gridApi!: GridApi<any>;
  private cashDeskTypes:any = {1:"CashDesk", 3:"Terminal", 2:"Client"};
  private states:any = {1:"Active", 2:"Inactive"};
  private type = this.route.snapshot.data['type'];

  public columnDefs: ColDef[] = [
    {
      field: 'Id',
      headerName:$localize`Id`,
      filter: 'agNumberColumnFilter',
      filterParams: {
       buttons: ['apply', 'reset'],
       closeOnApply: true
     },
   },
   {
    field: 'BetShopId',
    headerName:$localize`BetShop Id`,
    filter: 'agNumberColumnFilter',
    filterParams: {
     buttons: ['apply', 'reset'],
     closeOnApply: true
   },
 },
    { field: 'TypeName',  headerName:$localize`Type Name`,},
    {
      field: 'Name',
      headerName:$localize`Name`,
      filter: 'agTextColumnFilter',
      filterParams: {
       buttons: ['apply', 'reset'],
       closeOnApply: true
     },
   },
    { field: 'Balance',  headerName:$localize`Balance`,},
    { field: 'TerminalBalance',  headerName:$localize`Terminal Balance`,},
    { field: 'StateName',  headerName:$localize`State`,},
    { field: 'Type',  headerName:$localize`Type`,},
    { field: 'CreationTime',  headerName:$localize`Creation Time`,}
  ];


  constructor(
     private apiService: ApiService,
     private route:ActivatedRoute,
     private authService: AuthService){}

  onGridReady(params: GridReadyEvent)
  {
    this.gridApi = params.api;
    this.apiService.apiCall(Methods.GET_CASH_DESKS, {CashDeskId:this.authService.getCashier.CashDeskId}).subscribe(data => {
      if(data.ResponseCode === 0)
      {
        this.rowData.update(rowData => data.ResponseObject.Entities.filter((f:any) => f.Type === this.type).map((item:any) => {
          item.TypeName = this.cashDeskTypes[item.Type];
          item.StateName = this.states[item.State];
          return item;
        }));
      }
    });
    //this.gridApi.sizeColumnsToFit();
  }

}
