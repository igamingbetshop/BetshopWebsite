import {ChangeDetectionStrategy, Component, ViewEncapsulation, inject} from '@angular/core';
import { NgFor } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import {PrintService} from "../../../core/services/print.service";

@Component({
  selector: 'bs-devices',
  standalone: true,
  imports: [NgFor, MatSelectModule, MatFormFieldModule],
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss'],
  encapsulation:ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DevicesComponent {

  printService = inject(PrintService);

}
