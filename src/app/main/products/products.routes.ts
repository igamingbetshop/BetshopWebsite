import {Router, Routes} from "@angular/router";
import {ProductComponent} from "./product/product.component";
import {ProductsComponent} from "./products.component";
import {inject} from "@angular/core";
import {MatDialog} from "@angular/material/dialog";
import {CashboxComponent} from "../cashbox/cashbox.component";
import {MenuService} from "../../core/services/menu.service";

export const PRODUCTS_ROUTES:Routes = [
  {
    path: '',
    redirectTo: "sport/6",
    pathMatch: 'full'
  },
  {
    path:":productsGroup",
    component:ProductsComponent,
    children:[
      {
        path:":productId",
        component:ProductComponent
      }
    ]
  }
]
