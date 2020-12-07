import { Component, HostListener, OnInit } from '@angular/core';
import { UserModel } from 'src/app/data/models/user.model';
import { AuthorizationService } from '../../core/authorization/authorization.service';
import { PostAccessService } from '../../data/api-access/post-access.service';
import { PaginatiomModel } from '../../data/common/pagination-model';
import { PostModel } from '../../data/models/post.model';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'
  ]
})

export class HomeComponent implements OnInit {

  constructor(private _dataService: PostAccessService, 
    private _authService: AuthorizationService) {
  }
  public listOfPostFromApi: PostModel[] = null;
  public paginationParams: PaginatiomModel = null;
  private _isLoadingNewPosts : Boolean = false;
  public currentLoggedUserId: string = null;

  ngOnInit(): void {
    this.currentLoggedUserId = this._authService.currentUserId;
    this._dataService.getFriendsPosts(this._authService.currentUserId)
      .subscribe(
        result => {
          this.listOfPostFromApi = result.collection;
          this.paginationParams = result.paginationMetadata;
          console.log(this.listOfPostFromApi);
          console.log(this.paginationParams);
        },
        error => console.log('error', error)
      );
  }
  @HostListener("window:scroll", [])
  onScroll(): void {
    if (this.bottomReached() && this.paginationParams.hasNext && !this._isLoadingNewPosts) {
      let newPosts : PostModel[]  = null;
      this._isLoadingNewPosts = true;
      this._dataService.getFriendsPosts(this._authService.currentUserId, this.paginationParams.nextPageLink)
      .subscribe(
        result => {
          newPosts  = result.collection;
          this.paginationParams = result.paginationMetadata;

          this.listOfPostFromApi.push(... newPosts);
          console.log(this.listOfPostFromApi);
          console.log(this.paginationParams);
          this._isLoadingNewPosts = false;
        },
        error => console.log('error', error)
      );

    }
  }

  bottomReached(): boolean {
    // console.log('window.innerHeight + window.scrollY= ', window.innerHeight + window.scrollY, 'document.body.offsetHeight= ', document.body.offsetHeight-1)
    // console.log((window.innerHeight + window.scrollY) >= (document.body.offsetHeight-1));
    return (window.innerHeight + window.scrollY) >= (document.body.offsetHeight-1);
  }
}
