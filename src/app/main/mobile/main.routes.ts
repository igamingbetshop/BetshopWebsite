import {Router, Routes} from "@angular/router";
import {MainComponent} from "./main.component";
import {inject} from "@angular/core";
import {MatDialog} from "@angular/material/dialog";
import {CashboxComponent} from "../cashbox/cashbox.component";

export const MOBILE_MAIN_ROUTES:Routes = [
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
        loadChildren:() => import("../../main/products/products.routes").then(c => c.PRODUCTS_ROUTES),
      },
      {
        path:"payments",
        loadChildren:() => import("../../main/payments/payments.routes").then(r => r.PAYMENTS_ROUTES)
      },
      {
        path:"reports",
        loadChildren:() => import("../../main/reports/reports.routes").then(r => r.REPORTS_ROUTES)
      },
      {
        path:"accounts",
        loadChildren:() => import("../../main/accounts/accounts.routes").then(r => r.ACCOUNTS_ROUTES)
      },
      {
        path:"settings",
        loadChildren:() => import("../../main/settings/settings.routes").then(r => r.SETTINGS_ROUTES),
      },
      {
        path:"calculator",
        loadComponent:() => import("../../main/calculator/calculator.component").then(c => c.CalculatorComponent),
      },
      {
        path:"cash-box",
        redirectTo:(redirectData) => {
          const router = inject(Router);
          const dialog = inject(MatDialog);
          dialog.open(CashboxComponent, {panelClass:"cashbox"});
          return router.url;
        }
      }
    ]

  }
]
