import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot} from "@angular/router";
import {AuthService} from "../services/auth.service";
import {inject} from "@angular/core";

export function authGuard(): CanActivateFn {
  return (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const authService: AuthService = inject(AuthService);
    const router: Router = inject(Router);
    if (authService.isAuthenticated)
    {
      return true;
    }
    else
    {
      router.navigate(['/login'], {queryParams: route.queryParams});
      return false;
    }
  };
}
