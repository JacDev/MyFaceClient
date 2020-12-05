import { Component, Input, OnInit } from '@angular/core';
import { AuthorizationService } from 'src/app/core/authorization/authorization-index';
import { UserAccessService } from 'src/app/data/api-access/api-access-index';
import { PostCommentAccessService } from 'src/app/data/api-access/post-comments-access.service';
import { PaginatiomModel } from 'src/app/data/common/pagination-model';
import { PostCommentModel } from 'src/app/data/models/post-comment.model';
import { UserModel } from 'src/app/data/models/user.model';

@Component({
  selector: 'app-post-comment',
  templateUrl: './post-comments.component.html',
  styleUrls: ['./post-comments.component.css']
})
export class PostCommentsComponent implements OnInit {

  public listOfCommentsFromApi: PostCommentModel[] = null;
  public paginationParams: PaginatiomModel = null;
  @Input() postId: string;

  constructor(private _postCommentsAccess: PostCommentAccessService,
    private _authService: AuthorizationService,
    private _userAccess: UserAccessService) { }


  ngOnInit(): void {
    this._postCommentsAccess.getComments(this._authService.currentUserId, this.postId)
      .subscribe(
        result => {
          this.listOfCommentsFromApi = result.collection;
          this.paginationParams = result.paginationMetadata;

          for (let x = 0; x < this.listOfCommentsFromApi.length; x++) {
            this._userAccess.getUser(this.listOfCommentsFromApi[x].fromWho)
              .subscribe(
                resu => {
                  this.listOfCommentsFromApi[x].firstName = resu.firstName;
                  this.listOfCommentsFromApi[x].lastName = resu.lastName;
                },
                error => console.log('error', error)
              )
          }
          console.log(this.listOfCommentsFromApi);
          console.log(this.paginationParams);
        },
        error => console.log('error', error)
      );
  }
  LoadMoreComments() {
    if (this.paginationParams.hasNext) {
      let newPosts: PostCommentModel[] = null;
      this._postCommentsAccess.getComments(null, null, this.paginationParams.nextPageLink)
        .subscribe(
          result => {
            newPosts = result.collection;
            this.paginationParams = result.paginationMetadata;

            this.listOfCommentsFromApi.push(...newPosts);
            console.log(this.listOfCommentsFromApi);
            console.log(this.paginationParams);
          },
          error => console.log('error', error)
        );
    }
  }

}
