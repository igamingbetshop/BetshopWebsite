import {Routes} from "@angular/router";
import { PaymentsComponent } from "./payments.component";

export const PAYMENTS_ROUTES:Routes = [
  {
    path:"",
    component:PaymentsComponent,
    children:[
      {
        path:"deposit",
        loadComponent:() => import("../payments/deposit/deposit.component").then(c => c.DepositComponent)
      },
      {
        path:"withdraw",
        loadComponent:() => import("../payments/withdraw/withdraw.component").then(c => c.WithdrawComponent)
      },
      {
        path:"",
        redirectTo:"deposit",
        pathMatch:"prefix"
      }
    ]
  }
]
