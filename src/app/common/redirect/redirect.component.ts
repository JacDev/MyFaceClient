import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from 'src/app/core/authorization/index';

@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
  styles: [".btn:hover { background-color: rgb(100, 100, 100);"]
})
export class RedirectComponent implements OnInit {

  constructor(private _authService: AuthorizationService) { }

  ngOnInit(): void {
  }
  login() {
    this._authService.login();
  }
}