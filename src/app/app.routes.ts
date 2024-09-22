import {Routes} from "@angular/router";
import {LoginComponent} from "./login/login.component";
import {authGuard} from "./core/guards/auth-guard";
import {MacAddressComponent} from "./mac-address/mac-address.component";
import {mediaQueryMatcher} from "./core/guards/media-query-matcher";

export const APP_ROUTES:Routes = [
  {
    path:"",
    loadChildren: () => import("./main/mobile/main.routes").then(c => c.MOBILE_MAIN_ROUTES),
    canActivate:[authGuard()],
    canMatch:[mediaQueryMatcher],
  },
  {
    path:"",
    loadChildren: () => import("./main/main.routes").then(c => c.MAIN_ROUTES),
    canActivate:[authGuard()]
  },
  {
    path:"login",
    component:LoginComponent
  },
  {
    path:"macaddress",
    component:MacAddressComponent
  },
  {
    path: '**',
    redirectTo: "",
    pathMatch: 'full'
  }
]
