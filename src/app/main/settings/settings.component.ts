import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { MenuComponent } from 'src/app/shared/components/menu/menu.component';
import { RouterOutlet } from '@angular/router';
import { GeneralMenuDirective } from 'src/app/shared/directives/general-menu.directive';

@Component({
  selector: 'bs-settings',
  standalone: true,
  imports: [ChangePasswordComponent, MenuComponent, RouterOutlet, GeneralMenuDirective],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush

})
export class SettingsComponent
{

}
