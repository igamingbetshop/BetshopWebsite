import {ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'bs-actions',
  standalone: true,
    imports: [
      MatMenu,
      MatMenuItem,
      MatMenuTrigger
    ],
  templateUrl: './actions.component.html',
  styleUrl: './actions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActionsComponent {
  dialog = inject(MatDialog);
  async openAction(title:string, type:number)
  {
    const {ActionInfoComponent} = await import('./action-info/action-info.component');
    this.dialog.open(ActionInfoComponent, {data:{title:title, type:type}});
  }

}
