import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { AuthorizationService } from '../authorization/authorization.service';

@Injectable()
export class IsLoggedInRouteGuard implements CanActivate {
    constructor(private _authService: AuthorizationService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this._authService.isLoggedIn().then(loggedIn => {
            return loggedIn;
         });
    }
}