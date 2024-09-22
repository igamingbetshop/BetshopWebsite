import {ChangeDetectionStrategy, Component, computed, input, Signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BalanceService} from 'src/app/core/services/balance.service';
import {AuthService} from 'src/app/core/services/auth.service';

@Component({
  selector: 'bs-balance-limit',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './balance-limit.component.html',
  styleUrls: ['./balance-limit.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush,
})
export class BalanceLimitComponent {

  type = input.required<string>();
  value:Signal<number> = computed(() => this.type() === "balance" ? this.balanceService.balance().Balance : this.balanceService.balance().CurrentLimit);
  icon = computed(() => this.type() === "balance" ? "currency.svg" : "limit.svg");
  constructor(private balanceService:BalanceService, public authService:AuthService)
  {

  }

}
