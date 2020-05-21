import { Injectable } from '@angular/core';

import { CanActivate, Router } from '@angular/router';
import { UserService } from './user.service';


@Injectable()
export class RoleGuard implements CanActivate {


  constructor(private _router: Router, private _userService: UserService) {
  }
  canActivate(route: import("@angular/router").ActivatedRouteSnapshot, state: import("@angular/router").RouterStateSnapshot): boolean | import("@angular/router").UrlTree | import("rxjs").Observable<boolean | import("@angular/router").UrlTree> | Promise<boolean | import("@angular/router").UrlTree> {
    let identity = this._userService.getIdentity();

    if (identity && (identity.role == "ROLE_ADMIN")) {
      return true;
    } else {
      this._router.navigate(['/login']);
      return false;
    }
  }





}
