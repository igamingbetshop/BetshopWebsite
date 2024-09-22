import {Routes} from "@angular/router";
import { SettingsComponent } from "./settings.component";

export const SETTINGS_ROUTES:Routes = [
  {
    path:"",
    component:SettingsComponent,
    children:[
      {
        path:"monitors",
        loadComponent:() => import("../../main/settings/monitors/monitors.component").then(c => c.MonitorsComponent)
      },
      {
        path:"devices",
        loadComponent:() => import("../../main/settings/devices/devices.component").then(c => c.DevicesComponent)
      },
      {
        path:"change-password",
        loadComponent:() => import("../../main/settings/change-password/change-password.component").then(c => c.ChangePasswordComponent)
      },
      {
        path:"languages",
        loadComponent:() => import("../../main/settings/languages/languages.component").then(c => c.LanguagesComponent)
      },
      {
        path:"",
        redirectTo:"monitors",
        pathMatch:"prefix"
      }
    ]
  }
]
