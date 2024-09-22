import {ChangeDetectionStrategy, Component, inject, signal, WritableSignal} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {MatButton, MatButtonModule, MatIconButton} from "@angular/material/button";
import {MAT_DIALOG_DATA, MatDialogClose, MatDialogRef} from "@angular/material/dialog";
import {ApiService} from "../../../core/services/api.service";
import {Methods} from "../../../core/enums";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  selector: 'bs-action-info',
  standalone: true,
  imports: [
    MatIcon,
    MatIconButton,
    MatDialogClose,
    MatButton,
    MatButtonModule
  ],
  templateUrl: './action-info.component.html',
  styleUrl: './action-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActionInfoComponent {

 data:any = inject(MAT_DIALOG_DATA);
 dialogRef = inject(MatDialogRef<this>);
 apiService = inject(ApiService);
 total:WritableSignal<string> = signal("");

 constructor()
 {
   this.apiService.apiCall(Methods.GET_BET_SHOP_PLAYERS_DATA).pipe(takeUntilDestroyed()).subscribe((resp:any) => {
     if(resp.ResponseCode === 0)
     {
       this.total.set((this.data.type === 1 ? (resp.ResponseObject.TotalOpenPayouts || 0) : resp.ResponseObject.Balance) + resp.ResponseObject.CurrencyId);
     }
   });
 }

}
