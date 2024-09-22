import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterOutlet} from "@angular/router";
import {MatDrawer, MatSidenavModule} from "@angular/material/sidenav";
import {MatIcon} from "@angular/material/icon";
import {BalanceLimitComponent} from "../balance-limit/balance-limit.component";
import {NavigationComponent} from "../navigation/mobile/navigation.component";

@Component({
  selector: 'bs-main',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatSidenavModule, MatIcon, BalanceLimitComponent, NavigationComponent],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush

})
export class MainComponent {


  onDrawer(drawer:MatDrawer, type:string)
  {
    if(type === 'close')
      drawer.close();
    else drawer.open();
  }
}
