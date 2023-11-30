// import { CanActivateFn } from '@angular/router';

// export const authGuard: CanActivateFn = (route, state) => {
//   return true;
// };

import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class authGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.authService.isAuthenticated().pipe(
      map((isLoggedIn: boolean) => {
        console.log(isLoggedIn);
        if (isLoggedIn) {
          return true; // User is authenticated, allow access to the route
        } else {
          // User is not authenticated, redirect to login page
          return this.router.createUrlTree(['/login']); // Redirect to login page
        }
      })
    );
  }
}
