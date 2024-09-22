import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class MediaQueryService {

  private mediaQueryList = window.matchMedia("(max-width: 1000px)");
  private isHandset:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.mediaQueryList.matches);
  isHandset$ = this.isHandset.asObservable();

  constructor(private router:Router)
  {
    this.mediaQueryList.addEventListener("change", this.onChange);
  }

  onChange = (e:MediaQueryListEvent) => {
    this.isHandset.next(e.matches);
    this.router.navigateByUrl(this.router.url);
    //this.router.navigate([""]);
  }

}
