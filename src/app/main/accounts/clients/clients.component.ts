import { inject } from '@angular/core';
import { ChangeDetectionStrategy, Component, WritableSignal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GetContextMenuItemsParams, GridApi, GridReadyEvent, MenuItemDef } from 'ag-grid-community';
import { ApiService } from 'src/app/core/services/api.service';
import { Methods } from 'src/app/core/enums';
import { OpenerComponent } from 'src/app/shared/components/grid-common/opener/opener.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'bs-clients',
  standalone: true,
  imports: [CommonModule, AgGridModule, OpenerComponent],
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientsComponent {

  public rowData:WritableSignal<any[]> = signal([]);
  private gridApi!: GridApi<any>;
  private genders:any = {1:"Male", 2:"Female"};
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  filter = {
    ClientId: null,
    UserName: null,
    Email: null,
    DocumentNumber:null
  }

  columnDefs: ColDef[] = [
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
      field: 'Email',
      headerName:$localize`Email`,
      filter: 'agTextColumnFilter',
      filterParams: {
       buttons: ['apply', 'reset'],
       closeOnApply: true
     },
   },
    { field: 'CurrencyId', headerName:$localize`Currency Id`,},
    {
      field: 'UserName',
      headerName:$localize`User Name`,
      filter: 'agTextColumnFilter',
      filterParams: {
       buttons: ['apply', 'reset'],
       closeOnApply: true
     },
   },
    {
      field: 'GenderName',
      headerName:$localize`Gender`,
    },
    { field: 'BirthDate', headerName:$localize`Birth Date`},
    {
      field: 'FirstName',
      headerName:$localize`First Name`,
      filter: 'agTextColumnFilter',
      filterParams: {
       buttons: ['apply', 'reset'],
       closeOnApply: true
     },
   },
   {
    field: 'LastName',
    headerName:$localize`Last Name`,
    filter: 'agTextColumnFilter',
    filterParams: {
     buttons: ['apply', 'reset'],
     closeOnApply: true
   },
 },
    { field: 'Address', headerName:$localize`Address`,},
    { field: 'MobileNumber', headerName:$localize`Mobile Number`,},
    { field: 'DocumentNumber', headerName:$localize`Document Number`,},
    { field: 'Country', headerName:$localize`Country`,},
    { field: 'City', headerName:$localize`City`,},
    { field: 'CitizenshipName', headerName:$localize`Citizenship`,},
    { field: 'BuildingNumber', headerName:$localize`Building Number`,},
    { field: 'DocumentIssuedBy', headerName:$localize`Document IssuedBy`,},
    { field: 'CreationTime', headerName:$localize`Creation Time`,},
    { field: 'LastUpdateTime', headerName:$localize`Last Update Time`,},
    {
      field: 'View',
      cellRenderer: OpenerComponent,
      valueGetter: params => {
        let data:any = { path: '', queryParams: null };
        let replacedPart:any = this.route.snapshot.url[this.route.snapshot.url.length - 1].path;
        data.path = this.router.url.replace(replacedPart, 'client');
        data.queryParams = { clientId: params.data.Id };
        return data;
      },
    }
  ];

  public defaultColDef: ColDef = {
    resizable: true
  };

  constructor(private apiService: ApiService){}

  onGridReady(params: GridReadyEvent)
  {
    this.gridApi = params.api;
    this.apiService.apiCall(Methods.GET_CLIENTS, this.filter).subscribe(data => {
      if(data.ResponseCode === 0)
      {
        this.rowData.update(rowData => data.ResponseObject.Entities);
        this.rowData.set(data.ResponseObject.Entities.map((client:any) => {
          client.GenderName = this.genders[client.Gender];
          return client;
        }));
      }
    });
    //this.gridApi.sizeColumnsToFit();
  }

  getContextMenuItems(params: GetContextMenuItemsParams): (string | MenuItemDef)[]
  {
    return ['copy'];
  }

}
