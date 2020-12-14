import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthorizationService } from '../core/authorization/authorization.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @Output() loginRedirect: EventEmitter<number> = new EventEmitter();
  @Output() logoutRedirect: EventEmitter<number> = new EventEmitter();
  @Input() isLoggedIn: boolean;


  constructor(private authService: AuthorizationService) { }

  ngOnInit(): void {
  }
  login() {
    this.loginRedirect.emit(12);
  }
  logout() {
    this.logoutRedirect.emit(12);
  }
}
