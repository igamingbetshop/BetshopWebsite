import {Router, Routes} from "@angular/router";
import {MainComponent} from "./main.component";
import {inject} from "@angular/core";
import {MatDialog} from "@angular/material/dialog";
import {CalculatorComponent} from "./calculator/calculator.component";
import {CashboxComponent} from "./cashbox/cashbox.component";
import {ActionInfoComponent} from "./actions/action-info/action-info.component";

export const MAIN_ROUTES:Routes = [
  {
    path:"",
    component:MainComponent,
    children:[
      {
        path: '',
        redirectTo: "products",
        pathMatch: 'full'
      },
      {
        path:"products",
        loadChildren:() => import("../main/products/products.routes").then(c => c.PRODUCTS_ROUTES),
      },
      {
        path:"payments",
        loadChildren:() => import("../main/payments/payments.routes").then(r => r.PAYMENTS_ROUTES)
      },
      {
        path:"reports",
        loadChildren:() => import("../main/reports/reports.routes").then(r => r.REPORTS_ROUTES)
      },
      {
        path:"accounts",
        loadChildren:() => import("../main/accounts/accounts.routes").then(r => r.ACCOUNTS_ROUTES)
      },
      {
        path:"settings",
        loadChildren:() => import("../main/settings/settings.routes").then(r => r.SETTINGS_ROUTES),
      },
      {
        path:"calculator",
        redirectTo:(redirectData) => {
          const router = inject(Router);
          const dialog = inject(MatDialog);
          dialog.open(CalculatorComponent, {panelClass:"calculator", data:{close:true}});
          return router.url;
        }
      },
      {
        path:"cash-box",
        redirectTo:(redirectData) => {
          const router = inject(Router);
          const dialog = inject(MatDialog);
          dialog.open(CashboxComponent, {panelClass:"cashbox"});
          return router.url;
        }
      },
      {
        path:"open-payout",
        redirectTo:(redirectData) => {
          const router = inject(Router);
          const dialog = inject(MatDialog);
          dialog.open(ActionInfoComponent, {panelClass:"cashbox", data:{title:"Open payout", type:1}});
          return router.url;
        }
      },
      {
        path:"member-cards",
        redirectTo:(redirectData) => {
          const router = inject(Router);
          const dialog = inject(MatDialog);
          dialog.open(ActionInfoComponent, {panelClass:"cashbox", data:{title:"Membercard credits", type:2}});
          return router.url;
        }
      }
    ]
  }
]
