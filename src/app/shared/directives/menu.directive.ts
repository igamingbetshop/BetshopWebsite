import {Directive, Input, WritableSignal, signal, input} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Directive({
  selector: '[bsMenu]',
  standalone: true
})
export class MenuDirective {

  name = input.required<string>();
  menu:WritableSignal<any[]> = signal([]);
  isRender:WritableSignal<boolean> = signal<boolean>(false);

  constructor(
    private router:Router,
    private route:ActivatedRoute)
  {

  }

  checkRenderAndDefaultNavigation(useDefault:boolean = false)
  {
    this.isRender.set(this.menu().length > 1);

    if(useDefault && this.menu().length)
    {
      this.router.navigate([this.menu()[0].Href], {relativeTo: this.route});
    }
  }
}
