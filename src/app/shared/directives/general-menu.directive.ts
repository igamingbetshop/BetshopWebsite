import { Directive, OnInit, inject } from '@angular/core';
import { MenuDirective } from './menu.directive';
import { ConfigService } from 'src/app/core/services/config.service';

@Directive({
  selector: '[bsGeneralMenu]',
  standalone: true,
  hostDirectives:[
    {
      directive:MenuDirective,
      inputs:["name"]
    }
  ]
})
export class GeneralMenuDirective implements OnInit {

  menuDirective = inject(MenuDirective);

  constructor(private configService:ConfigService)
  {

  }

  ngOnInit(): void
  {
    this.menuDirective.menu.set(this.configService.settings[this.menuDirective.name()]);
    this.menuDirective.checkRenderAndDefaultNavigation();
  }
}
