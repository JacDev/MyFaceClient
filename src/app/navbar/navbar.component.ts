import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NotificationService } from '../data/notification.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @Output() loginRedirect = new EventEmitter();
  @Output() logoutRedirect = new EventEmitter();
  @Input() isLoggedIn: boolean;
  public newNotificationCounter: number = 0;


  constructor(private _notificationService: NotificationService) { }

  ngOnInit(): void {
    this._notificationService.newNotification.subscribe(result => {
            this.newNotificationCounter++;
    })
  }
  login() {
    this.loginRedirect.emit({});
  }
  logout() {
    this.logoutRedirect.emit({});
  }
}
