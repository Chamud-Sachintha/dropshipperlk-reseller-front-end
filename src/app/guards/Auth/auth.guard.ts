import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Request } from 'src/app/shared/models/Request/request';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

  requestParamModel = new Request();

  constructor(private router: Router) {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    
    const token = sessionStorage.getItem("authtoken");
    const kycStatus = sessionStorage.getItem("kycStatus");

    const path = this.router.url.replace(/\s/g, "");
    console.log(kycStatus)
    if ((token == null || token == undefined) && this.router.url != path) {
      this.router.navigate(['/auth/login']);
      return false;
    } else if (kycStatus == null || kycStatus == undefined || kycStatus != "1") {
      this.router.navigate(['/app/profile']);
      return false;
    } else {
      return true;  
    }
  }
}
