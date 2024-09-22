import { Directive, HostBinding, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[dropdown]',
  standalone:true,
  host: {
    '(window:blur)': 'close()',
    '(document:click)': 'close()',
  },
})
export class DropdownDirective {

  @HostBinding('class.opened') opened: boolean = false;

  constructor(private el: ElementRef) {}

  @HostListener('click', ['$event']) onDropdownClick($event:MouseEvent)
  {
    if(this.el.nativeElement == $event.currentTarget)
    {
      $event.stopPropagation();
      this.opened = !this.opened;
      let event = new CustomEvent('closeDropDown', {detail:this.el.nativeElement});
      document.dispatchEvent(event);
    }
  }

  @HostListener('document:closeDropDown', ['$event']) closeByDetails($event:CustomEvent)
  {
    if($event.detail != this.el.nativeElement)
      this.opened = false;
  }

  close()
  {
    this.opened = false;
  }
}
