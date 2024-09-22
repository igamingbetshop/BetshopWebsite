import { Component, ChangeDetectionStrategy } from '@angular/core';
import {RouterOutlet} from "@angular/router";
import { MenuComponent } from 'src/app/shared/components/menu/menu.component';

@Component({
  selector: 'bs-products',
  standalone: true,
  imports: [RouterOutlet, MenuComponent],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class ProductsComponent
{
  constructor()
  {

  }
}
