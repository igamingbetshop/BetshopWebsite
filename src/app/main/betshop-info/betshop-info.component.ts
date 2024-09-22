import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogClose } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { take } from 'rxjs';
import { Methods } from 'src/app/core/enums';
import { ApiService } from 'src/app/core/services/api.service';

@Component({
  selector: 'bs-betshop-info',
  standalone: true,
  imports: [MatIconModule, MatDialogClose, MatButtonModule],
  templateUrl: './betshop-info.component.html',
  styleUrl: './betshop-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BetshopInfoComponent {

  private apiService = inject(ApiService);

  getBetshopInfo()
  {
    this.apiService.apiCall(Methods.GET_BET_SHOP_INFO).pipe(take(1)).subscribe(data => {

    });
  }

}
