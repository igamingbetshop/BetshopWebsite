/// <reference types="@angular/localize" />

import {AppComponent} from "./app/app.component";
import {bootstrapApplication} from "@angular/platform-browser";
import {provideAnimations} from "@angular/platform-browser/animations";
import {provideRouter, withRouterConfig} from "@angular/router";
import {APP_ROUTES} from "./app/app.routes";
import {APP_INITIALIZER, importProvidersFrom} from "@angular/core";
import {HTTP_INTERCEPTORS, HttpClient, provideHttpClient} from "@angular/common/http";
import {ConfigService} from "./app/core/services/config.service";
import {APIInterceptor} from "./app/core/interceptors/api.interceptor";
import {MAT_SNACK_BAR_DEFAULT_OPTIONS} from "@angular/material/snack-bar";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from "@angular/material/form-field";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import {MenuService} from "./app/core/services/menu.service";
export function initializeApp(config: ConfigService, menu:MenuService): () => Promise<any> {
  return () => {
    return Promise.all([config.load(), menu.load()]);
  };
}

export function HttpLoaderFactory(httpClient: HttpClient)
{
  return new TranslateHttpLoader(httpClient,  `/assets/i18n/`, '.json');
}


bootstrapApplication(AppComponent, {providers:[
    importProvidersFrom([
      TranslateModule.forRoot({
        loader:{
          provide: TranslateLoader,
          useFactory:HttpLoaderFactory,
          deps: [HttpClient]
        },
        defaultLanguage: 'en'
      })
    ]),
    provideHttpClient(),
    provideAnimations(),
    provideRouter(APP_ROUTES, withRouterConfig({paramsInheritanceStrategy:"always", onSameUrlNavigation:"reload"})),
    {
      provide:APP_INITIALIZER,
      useFactory: initializeApp,
      multi: true,
      deps:[ConfigService, MenuService]
    },
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2500}},
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: "outline"}},
    {provide: HTTP_INTERCEPTORS, useClass: APIInterceptor, multi: true},
  ]})
  .catch(err => console.error(err));
