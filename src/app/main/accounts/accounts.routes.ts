import { ClientComponent } from './client/client.component';
import {Routes} from "@angular/router";
import { AccountsComponent } from "./accounts.component";
import { CashDesks } from "src/app/core/enums";

export const ACCOUNTS_ROUTES:Routes = [
  {
    path:"",
    component:AccountsComponent,
    children:[
      {
        path:"cash-desks",
        data:{type:CashDesks.CASH_DESK},
        loadComponent:() => import("../accounts/cashdesks/cashdesks.component").then(c => c.CashdesksComponent)
      },
      {
        path:"terminals",
        data:{type:CashDesks.TERMINAL},
        loadComponent:() => import("../accounts/cashdesks/cashdesks.component").then(c => c.CashdesksComponent)
      },
      {
        path:"clients",
        loadComponent:() => import("../accounts/clients/clients.component").then(c => c.ClientsComponent)
      },
      {
        path:"client",
        loadComponent:() => import("../accounts/client/client.component").then(c => c.ClientComponent)
      },
      {
        path:"register-client",
        loadComponent:() => import("../accounts/register-client/register-client.component").then(c => c.RegisterClientComponent)
      },
      {
        path:"",
        redirectTo:"cash-desks",
        pathMatch:"prefix"
      }
    ]
  }
]
