import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthorizationService } from './core/authorization/authorization.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'MyFaceClient';
  isLoggedIn = false;

  constructor(private _authService: AuthorizationService,
    private router: Router) {
    this._authService.loginChanged.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
    })
  }

  ngOnInit() {
   // this.router.navigate(['localhost:4200/{chat:chat}'])
    //this.router.navigate(['chat', { outlets: { outletName: ['chat'] } }], { skipLocationChange: true }).catch(err=>{console.log(err)});
    this._authService.isLoggedIn().then(loggedIn => {
      this.isLoggedIn = loggedIn;
    })
  }
  redirectToSTS(number) {
    this._authService.login();
  }

   logout(number) {
     this._authService.logout();
   }
}
