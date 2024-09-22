import { BalanceLimitComponent } from './../balance-limit/balance-limit.component';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
  WritableSignal
} from '@angular/core';
import {NgFor, NgOptimizedImage} from '@angular/common';
import {NavigationEnd, RouterLink, RouterLinkActive} from "@angular/router";
import {DocumentsComponent} from "../documents/documents.component";
import {ActionsComponent} from "../actions/actions.component";
import {BaseNavigation} from "./base-navigation";
import {DropdownDirective} from "../../shared/directives/dropdown-directive";
import {filter, Subscription} from "rxjs";
import {RouterLinkActiveGroupDirective} from "../../shared/directives/router-link-active-group.directive";

@Component({
  selector: 'bs-navigation',
  standalone: true,
    imports: [NgFor, RouterLink, RouterLinkActive, BalanceLimitComponent,
      DocumentsComponent, ActionsComponent, DropdownDirective, NgOptimizedImage, RouterLinkActiveGroupDirective],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})

export class NavigationComponent extends BaseNavigation implements OnInit
{
  #destroyRef = inject(DestroyRef).onDestroy(() => {
    this.#subscription.unsubscribe();
  });
  #subscription!:Subscription;
  urlAfterRedirects = signal<string>(this.router.url);
  leftMenus = computed(() => this.menus().filter(menu => menu.Name !== "Settings" &&  menu.Name !== "Calculator"));
  cashBoxMenus = computed(() => this.menus().filter(menu => menu.Name === "Calculator"));
  settingsMenus = computed(() => this.menus().filter(menu => menu.Name === "Settings"));

  override ngOnInit() {
    super.ngOnInit();
    this.#subscription = this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd)
    ).subscribe((e:any) => {
      this.urlAfterRedirects.set(e.urlAfterRedirects);
    });
  }


}
