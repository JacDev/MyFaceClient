import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PaginatiomModel } from 'src/app/data/common/pagination-model';
import { PostCommentModel } from 'src/app/data/models/post-comment.model';
import { PostCommentToUpdate } from './comment/post-comment-to-update.model';
import { PostCommentAccessService } from './post-comments-access.service';

@Component({
  selector: 'app-post-comment',
  templateUrl: './post-comments.component.html'
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

  constructor(private _postCommentsAccess: PostCommentAccessService) { }


  ngOnInit(): void {
    this.commentText = new FormControl();
    this.commentForm = new FormGroup({
      commentText: this.commentText
    })
    this._postCommentsAccess.getComments(this.currentLoggedUserId, this.postId)
      .subscribe(
        result => {
          this.listOfCommentsFromApi = result.collection;
          this.paginationParams = result.paginationMetadata;
        },
        error => console.log('error', error)
      );
  }
  loadMoreComments() {
    if (this.paginationParams.hasNext) {
      this._postCommentsAccess.getNextComments(this.paginationParams.nextPageLink)
        .subscribe(
          result => {
            this.paginationParams = result.paginationMetadata;
            this.listOfCommentsFromApi.push(...result.collection);
          },
          error => console.log('error', error)
        );
    }
  }
  hideComments() {
    this.hideCommentsEmitter.emit(true);
  }
  addComment(commentForm: FormGroup) {
    if (commentForm.value.commentText && commentForm.value.commentText.trim().length != 0) {
      this.isLoading = true;
      let text: string = commentForm.value.commentText.trimEnd()
      this._postCommentsAccess.postComment(this.displayedUserId, this.postId, text, this.currentLoggedUserId)
        .subscribe(result => {
          this.isLoading = false;
          this.listOfCommentsFromApi.push(result);
          commentForm.reset();
        })
      this.changeCommentsCounterEmitter.emit(1);
    }
  }
  deleteComment(commentId: string) {
    this.isLoading = true;
    this._postCommentsAccess.deleteComment(this.displayedUserId, this.postId, commentId)
      .subscribe(_ => {
        this.isLoading = false;
        this.changeCommentsCounterEmitter.emit(-1);
        this.listOfCommentsFromApi = this.listOfCommentsFromApi.filter(x => x.id !== commentId);
      },
        error => console.log('error', error));
  }
  editComment(comment: PostCommentToUpdate) {
    this.isLoading = true;
    this._postCommentsAccess.patchComment(this.currentLoggedUserId, this.postId, comment.id, comment.text)
      .subscribe(_ => {
        this.isLoading = false;
      });
   this.listOfCommentsFromApi.find(x => x.id === comment.id).text = comment.text;
  }
}
