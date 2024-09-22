import { Directive, WritableSignal, inject, signal } from "@angular/core";
import { ColDef, GetContextMenuItemsParams, GridApi, GridReadyEvent, MenuItemDef } from "ag-grid-community";
import { ReportFilter } from "src/app/core/interfaces";
import { ApiService } from "src/app/core/services/api.service";
import { ReportFilterService } from "src/app/main/reports/filters/report-filter.service";

@Directive()
export class BaseGrid
{
  protected apiService = inject(ApiService);
  protected reportService = inject(ReportFilterService);
  rowData:WritableSignal<any[]> = signal([]);
  gridApi!: GridApi<any>;
  columnDefs: ColDef[] = [];
  defaultColDef: ColDef = {flex:1};

  onGridReady(params: GridReadyEvent)
  {
    this.gridApi! = params.api;
    this.getData(this.reportService.filter());
  }

  getContextMenuItems(params: GetContextMenuItemsParams): (string | MenuItemDef)[]
  {
    return ['copy'];
  }

  getData(filter:ReportFilter)
  {

  }
}
