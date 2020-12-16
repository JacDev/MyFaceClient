import { Component, HostListener, OnInit } from '@angular/core';
import { AuthorizationService } from 'src/app/core/authorization/authorization-index';
import { UserFriendsAccessService } from 'src/app/data/api-access';
import { PaginatiomModel } from 'src/app/data/common/pagination-model';
import { UserModel } from 'src/app/data/models/user.model';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html'
})
export class FriendsComponent implements OnInit {

  public listOfUsersFromApi: UserModel[] = null;
  public paginationParams: PaginatiomModel = null;

  constructor(private _dataService: UserFriendsAccessService,
    private _authService: AuthorizationService) { }

  ngOnInit(): void {
    this._dataService.getFriends(this._authService.currentUserId)
      .subscribe(
        result => {
          this.listOfUsersFromApi = result.collection;
          this.paginationParams = result.paginationMetadata;
        },
        error => console.log('error', error)
      );
  }

  @HostListener("window:scroll", [])
  onScroll(): void {
    if (this.bottomReached() && this.paginationParams.hasNext) {
      this._dataService.getNextFriends(this.paginationParams.nextPageLink)
        .subscribe(
          result => {
            this.paginationParams = result.paginationMetadata;
            this.listOfUsersFromApi.push(...result.collection);
          },
          error => console.log('error', error)
        );
    }
  }
  bottomReached(): boolean {
    return (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 1);
  }
}
