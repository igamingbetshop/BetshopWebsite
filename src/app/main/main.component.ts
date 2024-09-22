import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NavigationComponent} from "./navigation/navigation.component";
import {RouterOutlet} from "@angular/router";
import { PrintService } from '../core/services/print.service';

@Component({
  selector: 'bs-main',
  standalone: true,
  imports: [CommonModule, NavigationComponent, RouterOutlet],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush

})
export class MainComponent {

  print = inject(PrintService);

}
