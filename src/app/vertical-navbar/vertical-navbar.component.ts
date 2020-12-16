import { Component, HostListener, OnInit } from '@angular/core';
import { UserAccessService } from '../data/api-access/index';
import { PaginatiomModel } from '../data/common/pagination-model';
import { UserModel } from '../data/models/user.model';

@Component({
  selector: 'app-vertical-navbar',
  templateUrl: './vertical-navbar.component.html',
  styleUrls: ['./vertical-navbar.component.css']
})
export class VerticalNavbarComponent implements OnInit {
  public searchTerm: string = "";
  public foundUsers: UserModel[] =null;
  public screenHeight: number;
  public isLoadingNewUsers: boolean;
  public paginationParams: PaginatiomModel = null;
  constructor(private _userApiAccess: UserAccessService) { }

  ngOnInit(): void {
    this.getScreenSize();
  }
  searchUsers(searchTerm: string) {
    this._userApiAccess.getUsersWith(searchTerm)
      .subscribe(result => {
        console.log(result);
        this.paginationParams = result.paginationMetadata;
        this.foundUsers = result.collection;
      })
      
  }
  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight;
  }
  @HostListener("scroll", [])
  onScroll(event): void {
    //if (event.target.id == 'main-view') {
console.log(this.isLoadingNewUsers)
    if (this.bottomReached(event) && this.paginationParams.hasNext && !this.isLoadingNewUsers) {
      let newPosts: UserModel[] = null;
      this.isLoadingNewUsers = true;
      this._userApiAccess.getUsersWith(null, this.paginationParams.nextPageLink)
        .subscribe(
          result => {
            newPosts = result.collection;
            this.paginationParams = result.paginationMetadata;

            this.foundUsers.push(...newPosts);
            console.log(this.foundUsers);
            console.log(this.paginationParams);
            this.isLoadingNewUsers = false;
          },
          error => console.log('error', error)
        );
    }
  }
  bottomReached(event): boolean {
    //console.log((event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight - 50))
    return (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight - 50);
  }
}
