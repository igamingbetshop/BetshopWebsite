import { Component, ChangeDetectionStrategy, inject} from '@angular/core';
import {NgFor, NgIf} from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MenuDirective } from '../../directives/menu.directive';

@Component({
  selector: 'bs-menu',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink, RouterLinkActive],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush,
})
export class MenuComponent  {

  menuDirective = inject(MenuDirective);

}
