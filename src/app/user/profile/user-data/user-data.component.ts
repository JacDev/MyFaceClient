import { Component, Input, OnInit } from '@angular/core';
import { UserFriendsAccessService } from 'src/app/data/api-access';
import { UserModel } from 'src/app/data/models/user.model';

@Component({
  selector: 'user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.css']
})
export class UserDataComponent implements OnInit {
  @Input() displayedUser: UserModel;
  @Input() currentLoggedUserId: string;
  canAddFriend: boolean = false;
  canDeleteFriend: boolean = false;
  canAcceptFriend: boolean = false;
  constructor(private _friendAccess: UserFriendsAccessService) { }

  ngOnInit(): void {
    this._friendAccess.getFriendRelation(this.currentLoggedUserId, this.displayedUser.id)
      .subscribe(result => {
        if (result) {
          this.canDeleteFriend = true;
        }
        else {
          console.log('a')
          //czy można przyjąć zaproszenie
          //if można to:
          //else
          //this.canAddFriend=true;
        }

      })
  }

}
