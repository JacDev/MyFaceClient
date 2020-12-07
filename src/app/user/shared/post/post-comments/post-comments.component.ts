import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { stringify } from 'querystring';
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

  @Input() postId: string;
  @Input() currentLoggedUserId: string;
  @Input() displayedUserId: string;
  @Output() hideCommentsEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();

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
  addComment(comment: FormGroup) {
    console.log(comment.value.commentText[0]==='↵');
    console.log(comment.value)
    console.log(comment.value.commentText.trim().length == 0);
    if (!comment.value.commentText || comment.value.commentText.trim().length == 0) {
      console.log("pusty")
    }
    else {
      console.log(this.currentLoggedUserId);
      let commenttoret = comment.value.commentText.slice(0, -1);
      console.log(commenttoret);
      this._postCommentsAccess.postComment(this.displayedUserId, this.postId, { 'text': commenttoret, 'fromWho': this.currentLoggedUserId })

      .subscribe(result=>{
        this.listOfCommentsFromApi.push(result);
      })
    }
    comment.reset();
    //this.commentText.setValue('');
  }
  autoSize(e) {
    e.target.style.overflow = 'hidden';
    e.target.style.height = "auto";
    e.target.style.height = (e.target.scrollHeight) + "px";
  }
}
