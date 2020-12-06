import { Component, Input, OnInit } from '@angular/core';
import { UserAccessService } from 'src/app/data/api-access/api-access-index';
import { PostModel } from 'src/app/data/models/post.model';
import { UserModel } from 'src/app/data/models/user.model';


@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  @Input() postToDisplay: PostModel;
  @Input() currentUserId:string;
  public userToDisplay:UserModel;
  public showComments: boolean = false;

  constructor(private _userAccess: UserAccessService) { }

  ngOnInit(): void {
    this._userAccess.getUser(this.postToDisplay.userId)
      .subscribe(
        resu => {
          this.userToDisplay = resu;
        },
        error => console.log('error', error)
      )
  }
  ShowComments() {
    this.showComments = !this.showComments;
  }
}
