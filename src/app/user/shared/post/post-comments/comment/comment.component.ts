import { Component, Input, OnInit } from '@angular/core';
import { UserAccessService } from 'src/app/data/api-access/api-access-index';
import { PostCommentModel } from 'src/app/data/models/post-comment.model';
import { UserModel } from 'src/app/data/models/user.model';

@Component({
  selector: 'post-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {

  @Input() comment: PostCommentModel;
  @Input() userToDisplay: UserModel;
  @Input() currentLoggedUserId:string;
  constructor(private _userAccess: UserAccessService) { }

  ngOnInit(): void {
    this._userAccess.getUser(this.comment.fromWho)
      .subscribe(
        resu => {
          this.userToDisplay = resu;
        },
        error => console.log('error', error)
      )
  }
}