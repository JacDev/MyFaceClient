import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthorizationService } from './authorization.service';

@Component({
    selector: 'app-signin-callback',
    template: '<div></div>'
})
export class SigninRedirectCallbackComponent implements OnInit {

    constructor(public authService: AuthorizationService,
        private router: Router) { }

    ngOnInit(): void {
        this.authService.completeLogin().then(user => {
            this.router.navigate(['/'], {replaceUrl:true});
      })
    }
}
