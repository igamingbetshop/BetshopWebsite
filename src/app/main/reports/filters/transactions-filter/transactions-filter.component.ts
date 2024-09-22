import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { ReportFilterService } from '../report-filter.service';

@Component({
  selector: 'bs-transactions-filter',
  standalone: true,
  imports: [MatRadioModule, MatFormFieldModule, MatInputModule],
  templateUrl: './transactions-filter.component.html',
  styleUrl: './transactions-filter.component.scss',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class TransactionsFilterComponent {
  reportService = inject(ReportFilterService);

  constructor()
  {
    this.reportService.update({FilterBy:'date', LastShiftsNumber:1});
  }
}
