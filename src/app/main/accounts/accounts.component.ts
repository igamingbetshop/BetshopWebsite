import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from 'src/app/shared/components/menu/menu.component';
import { RouterOutlet } from '@angular/router';
import { GeneralMenuDirective } from 'src/app/shared/directives/general-menu.directive';

@Component({
  selector: 'bs-accounts',
  standalone: true,
  imports: [CommonModule, MenuComponent, RouterOutlet, GeneralMenuDirective],
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent {


}
