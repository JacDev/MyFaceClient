import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NotificationService } from '../data/notification.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @Output() loginRedirect: EventEmitter<number> = new EventEmitter();
  @Output() logoutRedirect: EventEmitter<number> = new EventEmitter();
  @Input() isLoggedIn: boolean;
  public newNotificationCounter: number = 0;


  constructor(private _notificationService: NotificationService) { }

  ngOnInit(): void {
    this._notificationService.newNotification.subscribe(result => {
      this.newNotificationCounter++;
    })
  }
  login() {
    this.loginRedirect.emit(12);
  }
  logout() {
    this.logoutRedirect.emit(12);
  }
}
