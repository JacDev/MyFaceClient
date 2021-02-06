import { Component, HostListener, Input, OnInit, SimpleChanges } from '@angular/core';
import { AuthorizationService } from 'src/app/core/authorization/index';
import { UserFriendsAccessService } from 'src/app/data/api-access';
import { PaginatiomModel } from 'src/app/common/models/pagination-model';
import { UserModel } from 'src/app/common/models/user.model';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'user-friends',
  templateUrl: './friends.component.html'
})
export class FriendsComponent implements OnInit {
  @Input() userId: string = null;
  public listOfUsersFromApi: UserModel[] = null;
  public paginationParams: PaginatiomModel = null;
  private loggedUser: string = null;
  public currentUserId: string = null;
  public showError: boolean = false;
  public isLoadingFriends: boolean = false;
  public canDelete: boolean = false;
  constructor(private _dataService: UserFriendsAccessService,
    private _authService: AuthorizationService,
    private _friendsService: UserFriendsAccessService,) { }


  ngOnChanges(changes: SimpleChanges): void {
    this.loadFriends();
  }
  ngOnInit(): void {
    this.loggedUser = this._authService.currentUserId;
    this.loadFriends();
  }

  loadFriends(): void {
    this.isLoadingFriends = true;
    let currentUserId: string = this.userId || this.loggedUser;
    this.canDelete = !currentUserId.localeCompare(this.loggedUser)
    this._dataService.getFriends(currentUserId)
      .subscribe(
        result => {
          this.listOfUsersFromApi = result.collection;
          this.paginationParams = result.paginationMetadata;
          this.isLoadingFriends = false;
        },
        error => this.showError = true
      );
  }
  @HostListener("window:scroll", [])
  onScroll(): void {
    if (this.bottomReached() && this.paginationParams?.hasNext) {
      this._dataService.getNextFriends(this.paginationParams.nextPageLink)
        .subscribe(
          result => {
            this.paginationParams = result.paginationMetadata;
            this.listOfUsersFromApi.push(...result.collection);
          },
          error => this.showError = true
        );
    }
  }
  bottomReached(): boolean {
    return (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 1);
  }
  deleteFriend(friendToRemove: string): void {
    Swal.fire({
      title: '<h6>Na pewno chcesz usunąć znajomego?</h6>',
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText:
        '<i class="fa fa-thumbs-up"></i>',
      confirmButtonAriaLabel: 'Thumbs up, great!',
      confirmButtonColor: 'rgb(56, 224, 79)',
      cancelButtonText:
        '<i class="fa fa-thumbs-down"></i>',
      cancelButtonAriaLabel: 'Thumbs down'
    }).then((result) => {
      if (result.isConfirmed) {
        this._friendsService.deleteFriend(this.loggedUser, friendToRemove)
          .subscribe(_ => {
            this.listOfUsersFromApi = this.listOfUsersFromApi.filter(x => x.id !== friendToRemove);
          },
            error => this.showError = true)
      }
    })
  }
}
