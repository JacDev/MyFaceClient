import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { NotificationModel } from '../common/models/notification.model';
import { AuthorizationService } from '../core/authorization/index';
import { PaginatiomModel } from '../common/models/pagination-model';
import { NotificationService } from '../data/notification.service';
import { Router } from '@angular/router';
import { UserModel } from '../common/models';
import { UserAccessService } from '../data/api-access';
import { ImageAccessService } from '../user/services';
import Swal from 'sweetalert2/dist/sweetalert2.js';

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
  public screenHeight: number;
  public isLoadingNewNotifications: boolean = false;
  public currentLoggedUser: UserModel = null;
  public currentLoggedUserId: string = null;
  public imageToShow: any = null;

  constructor(private _authService: AuthorizationService,
    private _notificationService: NotificationService,
    private _router: Router,
    private _userAccess: UserAccessService,
    private _imageAccess: ImageAccessService) { }

  ngOnInit(): void {
    this.getScreenSize();
    this.loadUser();
    this._notificationService.newNotification.subscribe(_ => {
      this.newNotificationCounter++;
    })
  }
  loadUser(): void {
    if (this._authService.currentUserId) {
      this.currentLoggedUserId = this._authService.currentUserId;
      this.getUser();
    }
    else {
      this._authService.userLoaded.subscribe(() => {
        this.currentLoggedUserId = this._authService.currentUserId;
        if (!this.currentLoggedUser) {
          this.getUser();
        }
      })
    }
  }

  getImageFromService(): void {
    if (this.currentLoggedUser?.profileImagePath) {
      this._imageAccess.getImage(this.currentLoggedUserId, this.currentLoggedUser.profileImagePath)
        .subscribe(data => {
          this.createImageFromBlob(data);;
        }, error => {
        });
    }
  }
  createImageFromBlob(image: Blob): void {
    let reader: FileReader = new FileReader();
    reader.addEventListener("load", () => {
      this.imageToShow = reader.result;
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  getUser(): void {
    this._userAccess.getUser(this.currentLoggedUserId)
      .subscribe(
        result => {
          this.currentLoggedUser = result;
          this.getImageFromService();
        },
      );
  }
  loadNotifications(): void {
    if (!this.listOfNotificationsFromApi || this.newNotificationCounter != 0) {
      if (this.isLoggedIn) {
        this.getNotifications();
      }
      else {
        this._authService.userLoaded.subscribe(_ => {
          this.getNotifications();
        })
      }
    }

  }
  private getNotifications(): void {
    this.isLoadingNewNotifications = true;
    this._notificationService.getNotifications(this._authService.currentUserId)
      .subscribe(notifications => {
        this.listOfNotificationsFromApi = notifications.collection;
        this.paginationParams = notifications.paginationMetadata;
        this.isLoadingNewNotifications = false;
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
    Swal.fire({
      title: '<h5>Na pewno chcesz się wylogować?</h5>',
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: 'Wyloguj',
      confirmButtonColor: 'rgb(253, 126, 20)',
      cancelButtonText: 'Wróć!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.logoutRedirect.emit({});
        this._router.navigate(['redirect']);
      }
    })
  }
  @HostListener('window:resize', ['$event'])
  getScreenSize(): void {
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
