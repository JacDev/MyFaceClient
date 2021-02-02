import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AuthorizationService } from 'src/app/core/authorization/index';
import { UserAccessService } from 'src/app/data/api-access/index';
import { PaginatiomModel } from 'src/app/common/models/pagination-model';
import { PostModel } from 'src/app/user/models/post.model';
import { UserModel } from 'src/app/common/models/user.model';
import { PostAccessService } from '../services/index';

@Component({
  templateUrl: './profile.component.html',
  styles: [`
      .active {
        color: #F97924 !important;
    }
    .notactive{
      color: white !important;
    }`]
})

export class ProfileComponent implements OnInit {

  constructor(private _postDataService: PostAccessService,
    private _userDataService: UserAccessService,
    private _authService: AuthorizationService,
    private _route: ActivatedRoute) {
  }

  public listOfPostFromApi: PostModel[] = null;
  public paginationParams: PaginatiomModel = null;
  public currentDisplayedUser: UserModel = null;
  public showPosts: boolean = true;
  private isLoadingNewPosts: Boolean = false;
  public loggedUserId: string = null;
  public showError: boolean = false;

  ngOnInit(): void {
    this.loadUser();
  }
  loadUser() {
    this.loggedUserId = this._authService.currentUserId;
    let currentUserId;
    this._route.params.subscribe((params: Params) => {
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
          error => this.showError = true
      }
    },
      error => this.showError = true);
  }
  getPosts(id: string): void {
    this._postDataService.getUserPosts(id)
      .subscribe(
        result => {
          this.listOfPostFromApi = result.collection;
          this.paginationParams = result.paginationMetadata;
        },
        error => this.showError = true
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
          error => this.showError = true
        );

    }
  }
  bottomReached(): boolean {
    return (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 1);
  }
  switchDisplay(): void {
    this.showPosts = !this.showPosts;
  }
}
