import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthorizationService } from 'src/app/core/authorization/authorization-index';
import { PostCommentAccessService } from 'src/app/data/api-access/api-access-index';
import { PaginatiomModel } from 'src/app/data/common/pagination-model';
import { PostCommentModel } from 'src/app/data/models/post-comment.model';

@Component({
  selector: 'app-post-comment',
  templateUrl: './post-comments.component.html',
  styleUrls: ['./post-comments.component.css']
})
export class PostCommentsComponent implements OnInit {

  public listOfCommentsFromApi: PostCommentModel[] = null;
  public paginationParams: PaginatiomModel = null;

  public commentForm: FormGroup;
  public commentText: FormControl;
  public isLoading: boolean = false;
  @Input() postId: string;
  @Input() currentLoggedUserId: string;
  @Input() displayedUserId: string;
  @Output() hideCommentsEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() changeCommentsCounterEmitter: EventEmitter<number> = new EventEmitter<number>();

  constructor(private _postCommentsAccess: PostCommentAccessService,
    private _authService: AuthorizationService,
    public element: ElementRef) { }


  ngOnInit(): void {
    this.commentText = new FormControl();
    this.commentForm = new FormGroup({
      commentText: this.commentText
    })
    this._postCommentsAccess.getComments(this._authService.currentUserId, this.postId)
      .subscribe(
        result => {
          this.listOfCommentsFromApi = result.collection;
          this.paginationParams = result.paginationMetadata;
          console.log(this.listOfCommentsFromApi);
          console.log(this.paginationParams);
        },
        error => console.log('error', error)
      );
  }
  loadMoreComments() {
    if (this.paginationParams.hasNext) {
      let newComments: PostCommentModel[] = null;
      this._postCommentsAccess.getComments(null, null, this.paginationParams.nextPageLink)
        .subscribe(
          result => {
            newComments = result.collection;
            this.paginationParams = result.paginationMetadata;

            this.listOfCommentsFromApi.push(...newComments);
            console.log(this.listOfCommentsFromApi);
            console.log(this.paginationParams);
          },
          error => console.log('error', error)
        );
    }
  }
  hideComments() {
    this.hideCommentsEmitter.emit(true);
  }
  addComment(commentForm: FormGroup) {

    if (!commentForm.value.commentText || commentForm.value.commentText.trim().length == 0) {
      console.log("pusty")
    }
    else {
      this.isLoading = true;
      let commentToAdd: string = commentForm.value.commentText.trimEnd()
      this._postCommentsAccess.postComment(this.displayedUserId, this.postId, { 'text': commentToAdd, 'fromWho': this.currentLoggedUserId })

        .subscribe(result => {
          this.isLoading = false;
          this.listOfCommentsFromApi.push(result);
        })
    }
    commentForm.reset();
    this.changeCommentsCounterEmitter.emit(1);
  }

  deleteComment(commentId: string) {
    this.isLoading = true;
    this._postCommentsAccess.deleteComment(this.displayedUserId, this.postId, commentId)
      .subscribe(result => {
        this.isLoading = false;
        this.changeCommentsCounterEmitter.emit(-1);
      },
        error => console.log('error', error));
    this.listOfCommentsFromApi = this.listOfCommentsFromApi.filter(x => x.id !== commentId);
  }
  editComment(comment: Object) {
    this.isLoading=true;
    const x = Object.keys(comment).map(key => comment[key]);
    this._postCommentsAccess.patchComment(this.currentLoggedUserId, this.postId, x[0], [{
      "op": "replace",
      "path": "/text",
      "value": x[1]
    }])
      .subscribe(_=>{
        this.isLoading = false;
      });
    const comm = this.listOfCommentsFromApi.find(x => x.id.localeCompare(x[0])).text = x[1];
  }
}
