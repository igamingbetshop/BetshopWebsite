import { ChangeDetectionStrategy, Component, inject, signal, WritableSignal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ReportFilterService } from '../report-filter.service';
import {MenuService} from "../../../../core/services/menu.service";

@Component({
  selector: 'bs-bets-filter',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule],
  templateUrl: './bets-filter.component.html',
  styleUrl: './bets-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BetsFilterComponent {

  menuService = inject(MenuService);
  reportService = inject(ReportFilterService);
  statuses:WritableSignal<any[]> = signal([
    {Name:"Uncalculated", Value:1},
    {Name:"Won", Value:2},
    {Name:"Lost", Value:3},
    {Name:"Returned", Value:4},
    {Name:"Paid", Value:5}
  ])
  products:WritableSignal<any[]> = signal(this.menuService.menus.filter(m => m.Group === "products").reduce((products:any, menu) => {
    products.push(...menu.SubMenu);
    return products;
  }, []));

}
