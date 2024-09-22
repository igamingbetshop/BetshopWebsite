import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import {finalize, tap} from 'rxjs';
import {LoaderService} from "../services/loader.service";
import {AuthService} from "../services/auth.service";
@Injectable({
  providedIn: 'root'
})
export class APIInterceptor implements HttpInterceptor {
  private requests: HttpRequest<any>[] = [];

  constructor(
    private loaderService: LoaderService,
    private auth: AuthService,
  ) {}

  removeRequest(req: HttpRequest<any>)
  {
    this.requests = this.requests.filter(request => request !== req);
    if(this.requests.length > 0)
      this.loaderService.show();
    else this.loaderService.hide();
  }

  intercept(req: HttpRequest<any>, next: HttpHandler)
  {
    this.requests.push(req);
    if(req.body?.Loading !== false)
    {
      this.loaderService.show();
    }
    delete req.body?.Loading;

    return next.handle(req)
      .pipe(
        tap({
          // Succeeds when there is a response; ignore other events0
          next: (event) => {
            if(event instanceof HttpResponse)
            {
              if (event.body.ResponseCode === 28 || event.body.ResponseCode === 29) {
                if (this.auth.isAuthenticated)
                {
                  this.auth.logout();
                }
              }
            }
          },
          // Operation failed; error is an HttpErrorResponse
          error: (error) => {
          }
        }),
        // Log when response observable either completes or errors
        finalize(() => {
          this.removeRequest(req);
        })
      );
  }
}
