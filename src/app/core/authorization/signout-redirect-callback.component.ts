import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthorizationService } from './authorization.service';

@Component({
    template: '<div></div>'
})
export class SignoutRedirectCallbackComponent implements OnInit {

    constructor(public authService: AuthorizationService,
        private router: Router) { }

    ngOnInit(): void {
        this.authService.completeLogout().then(_ => {
            this.router.navigate(['/'], {replaceUrl:true});
      })
    }
}
