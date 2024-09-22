import { Component, ChangeDetectionStrategy} from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {LoaderComponent} from "./loader/loader.component";
import {LoaderService} from "./core/services/loader.service";
import {NgIf} from "@angular/common";
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone:true,
  imports:[RouterOutlet, LoaderComponent, NgIf],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class AppComponent
{
  title = 'betshop';

  constructor(public loader:LoaderService, private translate:TranslateService)
  {
    const language = localStorage.getItem('lang') || 'en';
    this.translate.use(language);
  }
}
