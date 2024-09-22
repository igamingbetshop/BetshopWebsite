import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReportFilterService } from '../report-filter.service';

@Component({
  selector: 'bs-payments-filter',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule],
  templateUrl: './payments-filter.component.html',
  styleUrl: './payments-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentsFilterComponent {
  reportService = inject(ReportFilterService);
}
