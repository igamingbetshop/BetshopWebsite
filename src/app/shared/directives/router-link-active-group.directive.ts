import {computed, Directive, effect, ElementRef, HostBinding, inject, input, Renderer2} from "@angular/core";
import {Menu} from "../../core/interfaces";

@Directive({
  selector: '[routerLinkActiveGroup]',
  standalone: true
})
export class RouterLinkActiveGroupDirective {

  routerLinkActiveGroup = input.required<Menu, Menu>({transform:(menu:Menu) => {
      return menu;
    }});

  url = input.required<string, string>({transform:url => {
      return url;
    }});

  #element: ElementRef = inject(ElementRef);
  #renderer: Renderer2 = inject(Renderer2);
  private loggingEffect = effect(() => {
    this.#updateActiveClass();
  });

  #updateActiveClass()
  {
    let isActive = false;
    if(this.routerLinkActiveGroup().SubMenu.length)
      isActive =  this.routerLinkActiveGroup().SubMenu.some(el => el.RouterLink === this.url());
    else isActive =  this.url() === this.routerLinkActiveGroup().RouterLink;
    if(isActive)
      this.#renderer.addClass(this.#element.nativeElement, "active");
    else this.#renderer.removeClass(this.#element.nativeElement, "active");
  }

}
