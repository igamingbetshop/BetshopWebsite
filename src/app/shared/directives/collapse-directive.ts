import {Directive, HostBinding, HostListener, input} from "@angular/core";

@Directive({
  selector: '[collapse]',
  standalone: true
})
export class CollapseDirective {

  collapse = input(false, {transform: (value:boolean | string) => {
    this.opened = !!value;
    return value;
    }});

  @HostBinding('class.opened') opened: boolean = false;

  @HostListener('click', ['$event']) onCollapseClick($event:MouseEvent) {
    $event.stopPropagation();
    this.opened = !this.opened;
  }
}
