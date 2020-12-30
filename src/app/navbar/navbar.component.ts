import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { NotificationDto } from '../common/models/notificationDto.model';
import { AuthorizationService } from '../core/authorization/authorization-index';
import { PaginatiomModel } from '../data/common/pagination-model';
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

  public listOfNotificationsFromApi: NotificationDto[] = null;
  public paginationParams: PaginatiomModel = null;
  screenHeight: number;
  isLoadingNewNotifications: boolean = false;

  constructor(private _authService: AuthorizationService,
    private _notificationService: NotificationService) { }

  ngOnInit(): void {
    this.getScreenSize();
    this._notificationService.newNotification.subscribe(result => {
      this.newNotificationCounter++;
    })
  }
  loadNotifications() {
    if (!this.listOfNotificationsFromApi) {
      if (this.isLoggedIn) {
        this.loadUser();
      }
      else {
        this._authService.userLoaded.subscribe(() => {
          this.loadUser();
        })
      }
    }
  }
  private loadUser() {
    this._notificationService.getNotifications(this._authService.currentUserId)
      .subscribe(notifications => {
        console.log(notifications)
        this.listOfNotificationsFromApi = notifications.collection;
        this.paginationParams = notifications.paginationMetadata;
      })
  }
  login() {
    this.loginRedirect.emit({});
  }
  logout() {
    this.logoutRedirect.emit({});
  }
  @HostListener('window:resize', ['$event'])
  getScreenSize(event?): void {
    this.screenHeight = window.innerHeight;
  }
  @HostListener("scroll", ['$event'])
  onScroll(event: Event): void {
    if (this.bottomReached(event) && this.paginationParams.hasNext && !this.isLoadingNewNotifications) {
      this.isLoadingNewNotifications = true;
      this._notificationService.getNextNotifications(this.paginationParams.nextPageLink)
        .subscribe(
          result => {
            this.paginationParams = result.paginationMetadata;
            this.listOfNotificationsFromApi.push(...result.collection);
            this.isLoadingNewNotifications = false;
          },
          error => console.log('error', error)
        );
    }
  }
  bottomReached(event): boolean {
    return (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight - 110);
  }
}
