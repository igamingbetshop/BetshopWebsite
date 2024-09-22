import {Directive, inject, signal, WritableSignal} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {Menu} from "../../core/interfaces";
import {AuthService} from "../../core/services/auth.service";
import {TicketValidationComponent} from "../ticket-validation/ticket-validation.component";
import {Router} from "@angular/router";
import {MenuService} from "../../core/services/menu.service";

@Directive()
export class BaseNavigation {

  dialog = inject(MatDialog);
  menus:WritableSignal<Menu[]> = signal([]);
  authService:AuthService = inject(AuthService);
  router = inject(Router);
  private menuService:MenuService = inject(MenuService);

  ngOnInit()
  {
    this.menus.set(this.menuService.menus);
  }

  selectionChange(event:MouseEvent, url:string)
  {
    this.router.navigateByUrl(`/${url}`);
  }

  openTicketValidation()
  {
    this.dialog.open(TicketValidationComponent, {panelClass:"ticket-validation"});
  }
}
