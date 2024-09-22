import {Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from 'src/app/shared/components/menu/menu.component';
import {RouterOutlet} from '@angular/router';
import { GeneralMenuDirective } from 'src/app/shared/directives/general-menu.directive';
import { ReportFilterService } from './filters/report-filter.service';

@Component({
  selector: 'bs-reports',
  standalone: true,
  imports: [CommonModule, MenuComponent, RouterOutlet, GeneralMenuDirective],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  providers:[
    ReportFilterService
  ]
})
export class ReportsComponent {

}
