import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from './core/authorization/authorization.service';
import { HubService } from './data/hub.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'MyFace';
  isLoggedIn = false;

  constructor(private _authService: AuthorizationService,
    private _hubConection: HubService) { }

  ngOnInit() {
    this._authService.loginChanged.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
    })
    this._authService.isLoggedIn()
      .then(loggedIn => {
        this.isLoggedIn = loggedIn;
        this._hubConection.initConnection();

      })
  }
  redirectToSTS(event:any) {
    this._authService.login();
  }

  logout(event:any) {
    this._authService.logout();
  }
}
