import { ChangeDetectionStrategy, Component, WritableSignal, inject, signal } from '@angular/core';
import { ReportFilterService } from '../report-filter.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {MenuService} from "../../../../core/services/menu.service";

@Component({
  selector: 'bs-results-filter',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule],
  templateUrl: './results-filter.component.html',
  styleUrl: './results-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResultsFilterComponent {
  menuService = inject(MenuService);
  reportService = inject(ReportFilterService);
  products:WritableSignal<any[]> = signal(this.menuService.menus.find(menu => menu.Name === 'Games')?.SubMenu || []);
}
