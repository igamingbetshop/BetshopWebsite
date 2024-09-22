import {Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {ICellRendererParams} from "ag-grid-community";

@Component({
  selector: 'app-opener',
  templateUrl: './opener.component.html',
  styleUrls: ['./opener.component.scss'],
  imports:[RouterLink],
  standalone:true
})
export class OpenerComponent {
  public path: string;
  public queryParams:any;

  constructor()
  {

  }

  agInit(params: ICellRendererParams): void
  {
    this.path = params.value.path;
    this.queryParams = params.value.queryParams;
  }

  refresh(params: ICellRendererParams)
  {

  }

}
