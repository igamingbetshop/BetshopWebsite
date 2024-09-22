import { Injectable, WritableSignal, signal } from '@angular/core';
import { ConfigService } from './config.service';
import { Product } from '../interfaces/product';
import { ApiService } from './api.service';
import { Methods } from '../enums';
import { take } from 'rxjs';
import { AuthService } from './auth.service';
import {MenuService} from "./menu.service";

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  productUrl:WritableSignal<string> = signal("");

  constructor(
    private configService:ConfigService,
    private menuService:MenuService,
    private apiService:ApiService,
    private authService:AuthService) { }

  openProduct(productsGroup:string, productId:number)
  {
    this.productUrl.set("");
    const group = this.menuService.menus.find(group => group.Href === productsGroup);
    const product:Product = group?.SubMenu.find(product => product.Id == productId);
    const partnerId = this.authService.getCashier.PartnerId;
    const languageId = this.apiService.languageId;

    this.apiService.apiCall(Methods.GET_PRODUCT_SESSION, {ProductId:product.Id}).pipe(take(1)).subscribe(data => {
        if(data.ResponseCode === 0)
        {
            if (data.ResponseObject.LaunchUrl)
            {
              this.productUrl.set(data.ResponseObject.LaunchUrl);
            }
            else
            {
              const productToken = data.ResponseObject.ProductToken;
              product.CashierUrl.replace("http:", "https:");
              this.productUrl.set(`${product.CashierUrl}?gameid=${product.ExternalId}&viewtype=3&token=${productToken}&partnerid=${partnerId}&languageid=${languageId}`);
            }
        }
    });

  }
}
