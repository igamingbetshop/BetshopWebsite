import {ChangeDetectionStrategy, Component, DestroyRef, inject, signal} from '@angular/core';
import {SignalrService} from "../core/services/signalr.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {Methods} from "../core/enums";

@Component({
  selector: 'bs-mac-address',
  standalone: true,
  imports: [],
  templateUrl: './mac-address.component.html',
  styleUrl: './mac-address.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MacAddressComponent {

  macAddress = signal("");

  #signalR:SignalrService = inject(SignalrService);
  #destroyHref = inject(DestroyRef);

  constructor()
  {
    this.#signalR.onConnect().pipe(takeUntilDestroyed(this.#destroyHref)).subscribe(connect => {
      if(connect)
      {
        this.#signalR.sendMessage(Methods.GET_MAC_ADDRESS).pipe(takeUntilDestroyed(this.#destroyHref)).subscribe(data => {
          this.macAddress.set(data as string);
        });
      }
    });
  }

}
