import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, filter, catchError, mergeMap } from 'rxjs/operators';
import { UserAccessService } from 'src/app/data/api-access/api-access-index';

@Injectable()
export class UserRouteActivator implements CanActivate {
    constructor(private _userService: UserAccessService, private router: Router) {
    }
    canActivate(route: ActivatedRouteSnapshot) {
        return this._userService.getUser(route.params['id']).pipe(
            map(res => {
                console.log('From guard:', res)
                if (res['Error']) {
                    this.router.navigate(['/404'])
                    return false;
                } else {
                    return true;
                }
            }),
            catchError(err => {
                console.error('From guard:', err);
                this.router.navigate(['/404'])
                return of(false);
            })
        )
    }
};