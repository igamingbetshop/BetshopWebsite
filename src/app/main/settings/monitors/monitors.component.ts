import { ChangeDetectionStrategy, Component, WritableSignal, inject, signal } from '@angular/core';
import { NgFor } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import {Menu} from 'src/app/core/interfaces';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from 'src/app/core/services/api.service';
import { Methods } from 'src/app/core/enums';
import { take } from 'rxjs';
import {MenuService} from "../../../core/services/menu.service";

@Component({
  selector: 'bs-monitors',
  standalone: true,
  imports: [NgFor, MatSelectModule, MatFormFieldModule, MatButtonModule],
  templateUrl: './monitors.component.html',
  styleUrls: ['./monitors.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MonitorsComponent {

  menuService = inject(MenuService);
  apiService = inject(ApiService);

  menus:WritableSignal<Menu[]> = signal(this.menuService.menus.filter(m => m.Group === "products"));

  open(menu:Menu)
  {
    if(menu['SelectedProduct'])
    {
      const product:Menu = menu['SelectedProduct'];

      if(product['ProviderId'] === 1 || product['ProviderId'] === 100)
      {
        this.apiService.apiCall(Methods.GET_PRODUCT_SESSION, {ProductId:product['Id']})
        .pipe(take(1)).subscribe(data => {
          {
            if (data.ResponseCode === 0)
            {
                const cashier = this.apiService.authService.getCashier;
                const url = `${product['MonitorUrl']}?token=${data.ResponseObject.ProductToken}&gameid=${product['ExternalId']}&partnerid=${cashier.PartnerId}&languageid=${this.apiService.languageId}`;
                window.open(url);
            }
          }
        });
      }
      else
      {
        if(product['ProviderId'] == 4)
        {
          window.open(product['Monitors'][0]);
        }
      }
    }
  }

}
