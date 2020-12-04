import { Component, HostListener, OnInit } from '@angular/core';
import { AuthorizationService } from 'src/app/core/authorization/authorization-index';
import { UserFriendsAccessService } from 'src/app/data/api-access/user-friends-access.service';
import { PaginatiomModel } from 'src/app/data/common/pagination-model';
import { UserModel } from 'src/app/data/models/user.model';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
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
          console.log(this.listOfUsersFromApi);
          console.log(this.paginationParams);
        },
        error => console.log('error', error)
      );
  }

  @HostListener("window:scroll", [])
  onScroll(): void {
    if (this.bottomReached() && this.paginationParams.hasNext) {
      let newUsers: UserModel[] = null;
      this._dataService.getFriends(this._authService.currentUserId, this.paginationParams.nextPageLink)
        .subscribe(
          result => {
            newUsers = result.collection;
            this.paginationParams = result.paginationMetadata;

            this.listOfUsersFromApi.push(...newUsers);
            console.log(this.listOfUsersFromApi);
            console.log(this.paginationParams);
          },
          error => console.log('error', error)
        );
    }
  }

  bottomReached(): boolean {
    return (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 1);
  }

}
