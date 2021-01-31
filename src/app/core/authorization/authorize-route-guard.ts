import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthorizationService } from './authorization.service';

@Injectable()
export class AuthorizationRouteGuard implements CanActivate {
    constructor(private _authService: AuthorizationService,
        private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this._authService.isLoggedIn().then(loggedIn => {
            if (!loggedIn) {
                this.router.navigate(['redirect']);
                this._authService.login();
            }
            return loggedIn;
        });
    }
}