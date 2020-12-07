import { Component, Input, OnInit } from '@angular/core';
import { ReactionAccessService, UserAccessService } from 'src/app/data/api-access/api-access-index';
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
  public userToDisplay: UserModel;
  public showComments: boolean = false;
  public isAlreadyLike: boolean = false;
  public reactionCounter:number = 0;

  constructor(private _userAccess: UserAccessService,
    private _postReactionsAccess: ReactionAccessService) { }

  ngOnInit(): void {
    this.reactionCounter = this.postToDisplay.postReactionsCounter;
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
  hideComments(hide:boolean){
    this.showComments = false;
  }

}
