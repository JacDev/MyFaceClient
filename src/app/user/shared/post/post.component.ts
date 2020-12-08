import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PostAccessService, ReactionAccessService, UserAccessService } from 'src/app/data/api-access/api-access-index';
import { PostModel } from 'src/app/data/models/post.model';
import { UserModel } from 'src/app/data/models/user.model';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  @Input() postToDisplay: PostModel;
  @Input() currentLoggedUserId: string;
  @Output() deletePostFromListEvent: EventEmitter<string> = new EventEmitter<string>();

  public userToDisplay: UserModel;
  public showComments: boolean = false;
  public isAlreadyLike: boolean = false;
  public reactionCounter: number = 0;
  public commentsCounter: number = 0;
  public isLoading: boolean = false;
  constructor(private _userAccess: UserAccessService,
    private _postReactionsAccess: ReactionAccessService,
    private _postAccess: PostAccessService) { }

  ngOnInit(): void {
    this.reactionCounter = this.postToDisplay.postReactionsCounter;
    this.commentsCounter = this.postToDisplay.postCommentsCounter;
    this._userAccess.getUser(this.postToDisplay.userId)
      .subscribe(
        resu => {
          this.userToDisplay = resu;
        },
        error => console.log('error', error)
      );
    this._postReactionsAccess.getPostReactions(this.postToDisplay.userId, this.postToDisplay.id)
      .subscribe(
        result => {
          result.some(x => {
            if (x.fromWho == this.currentLoggedUserId) {
              this.isAlreadyLike = true;
            }
          })
        },
        error => console.log('error', error)
      )
  }

  ShowComments() {
    this.showComments = !this.showComments;
  }
  changeReacton() {
    if (this.isAlreadyLike) {
      this.reactionCounter--;
      this._postReactionsAccess.deletePostReactions(this.postToDisplay.userId, this.postToDisplay.id, this.currentLoggedUserId)
        .subscribe(response => {
          console.log(response);
        });
    }
    else {
      this.reactionCounter++;
      this._postReactionsAccess.postPostReactions(this.postToDisplay.userId, this.postToDisplay.id, this.currentLoggedUserId)
        .subscribe(response => {
          console.log(response);
        });
    }
    this.isAlreadyLike = !this.isAlreadyLike;
  }
  hideComments(hide: boolean) {
    this.showComments = false;
  }
  changeCommentsCounter(event: number) {
    this.commentsCounter += event;
  }
  editPost() {
    Swal.fire({
      input: 'textarea',
      inputAttributes: { color: 'white' },
      inputValue: this.postToDisplay.text,
      showCancelButton: true,
      confirmButtonColor: 'rgb(56, 224, 79)',

    }).then((result) => {
      console.log(result);
      if (result.isConfirmed && result.value.trim().length != 0) {
        this.isLoading = true;
        this.postToDisplay.text = result.value;
        this._postAccess.patchPost(this.currentLoggedUserId, this.postToDisplay.id,
          [{
            "op": "replace",
            "path": "/text",
            "value": result.value
          }]
        ).subscribe(_ => {
          this.isLoading = false;
        });
      }
    })
  }
  deletePost() {
    Swal.fire({
      title: '<h6>Na pewno chcesz usunąć post?</h6>',
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText:
        '<i class="fa fa-thumbs-up"></i>',
      confirmButtonAriaLabel: 'Thumbs up, great!',
      confirmButtonColor: 'rgb(56, 224, 79)',
      cancelButtonText:
        '<i class="fa fa-thumbs-down"></i>',
      cancelButtonAriaLabel: 'Thumbs down'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this._postAccess.deletePost(this.currentLoggedUserId, this.postToDisplay.id)
          .subscribe(result => {
            this.isLoading = false;
            console.log(result)
            this.deletePostFromListEvent.emit(this.postToDisplay.id);
          },
            error => console.log('error', error));
      }
    })
  }
}
