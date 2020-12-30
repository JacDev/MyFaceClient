import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AuthorizationService } from 'src/app/core/authorization/authorization-index';
import { UserAccessService } from 'src/app/data/api-access/index';
import { PaginatiomModel } from 'src/app/data/common/pagination-model';
import { PostModel } from 'src/app/data/models/post.model';
import { UserModel } from 'src/app/data/models/user.model';
import { PostAccessService } from '../services/index';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})

export class ProfileComponent implements OnInit {

  constructor(private _postDataService: PostAccessService,
    private _userDataService: UserAccessService,
    private _authService: AuthorizationService,
    private route: ActivatedRoute) {
  }

  public listOfPostFromApi: PostModel[] = null;
  public paginationParams: PaginatiomModel = null;
  public currentDisplayedUser: UserModel = null;
  private isLoadingNewPosts: Boolean = false;
  public loggedUserId: string = null;

  ngOnInit(): void {
    this.loadUser();
  }
  loadUser() {
    this.loggedUserId = this._authService.currentUserId;
    let currentUserId;
    this.route.params.subscribe((params: Params) => {
      currentUserId = params['id'];
      if (!currentUserId || currentUserId === this.loggedUserId) {
        this.currentDisplayedUser = this._authService.currentUser;
          this.getPosts(this.loggedUserId);
      }
      else {
        this._userDataService.getUser(currentUserId)
          .subscribe(
            result => {
              this.currentDisplayedUser = result;
              this.getPosts(result.id);
            }
          ),
          error => console.log('error', error)
      }
    });    
  }
  getPosts(id:string) {
    return this._postDataService.getUserPosts(id)
      .subscribe(
        result => {
          this.listOfPostFromApi = result.collection;
          this.paginationParams = result.paginationMetadata;
        },
        error => console.log('error', error)
      );
  }
  @HostListener("window:scroll", [])
  onScroll(): void {
    if (this.bottomReached() && this.paginationParams.hasNext && !this.isLoadingNewPosts) {
      this.isLoadingNewPosts = true;
      this._postDataService.getUserNextPosts(this.paginationParams.nextPageLink)
        .subscribe(
          result => {
            this.paginationParams = result.paginationMetadata;
            this.listOfPostFromApi.push(...result.collection);
            this.isLoadingNewPosts = false;
          },
          error => console.log('error', error)
        );

    }
  }
  bottomReached(): boolean {
    return (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 1);
  }
}
