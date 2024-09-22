import {Routes} from "@angular/router";
import { ReportsComponent } from "./reports.component";

export const REPORTS_ROUTES:Routes = [
  {
    path:"",
    component:ReportsComponent,
    children:[
      {
        path:"report-by-bets",
        loadComponent:() => import("./report-by-bets/report-by-bets.component").then(c => c.ReportByBetsComponent)
      },
      {
        path:"report-by-shifts",
        loadComponent:() => import("./report-by-shifts/report-by-shifts.component").then(c => c.ReportByShiftsComponent)
      },
      {
        path:"report-by-transactions",
        loadComponent:() => import("./report-by-transactions/report-by-transactions.component").then(c => c.ReportByTransactionsComponent)
      },
      {
        path:"report-by-payments",
        loadComponent:() => import("./report-by-payments/report-by-payments.component").then(c => c.ReportByPaymentsComponent)
      },
      {
        path:"report-by-results",
        loadComponent:() => import("./report-by-results/report-by-results.component").then(c => c.ReportByResultsComponent)
      },
      {
        path:"",
        redirectTo:"report-by-bets",
        pathMatch:"prefix"
      }
    ]
  }
]
