import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { NotificationModel } from '../common/models/notification.model';
import { AuthorizationService } from '../core/authorization/index';
import { PaginatiomModel } from '../common/models/pagination-model';
import { NotificationService } from '../data/notification.service';
import { Router } from '@angular/router';

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

  public listOfNotificationsFromApi: NotificationModel[] = null;
  public paginationParams: PaginatiomModel = null;
  screenHeight: number;
  isLoadingNewNotifications: boolean = false;

  constructor(private _authService: AuthorizationService,
    private _notificationService: NotificationService,
    private _router: Router) { }

  ngOnInit(): void {
    this.getScreenSize();
    this._notificationService.newNotification.subscribe(_ => {
      this.newNotificationCounter++;
    })
  }
  loadNotifications(): void {
    if (!this.listOfNotificationsFromApi || this.newNotificationCounter != 0) {
      if (this.isLoggedIn) {
        this.loadUser();
      }
      else {
        this._authService.userLoaded.subscribe(_ => {
          this.loadUser();
        })
      }
    }

  }
  private loadUser() : void{
    this._notificationService.getNotifications(this._authService.currentUserId)
      .subscribe(notifications => {
        this.listOfNotificationsFromApi = notifications.collection;
        this.paginationParams = notifications.paginationMetadata;
        this.listOfNotificationsFromApi.forEach(element => {
          if (!element.hasSeen) {
            this._notificationService.markNotificationAsSeen(element.fromWho, element.id)
              .subscribe(_ => this.newNotificationCounter = 0);
          }
        });
      })
  }
  login(): void {
    this.loginRedirect.emit({});
  }
  logout(): void {
    this.logoutRedirect.emit({});
  }
  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: Event): void {
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
        );
    }
  }
  bottomReached(event): boolean {
    return (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight - 110);
  }
  redirectToChat(): void {
    this._router.navigate(['chat']);
  }
  redirectToFind(): void {
    this._router.navigate(['find']);
  }
}
