import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthorizationService } from './core/authorization/authorization.service';
import { HubService } from './data/hub.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'MyFaceClient';
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
  redirectToSTS(number) {
    this._authService.login();
  }

  logout(number) {
    this._authService.logout();
  }
}
