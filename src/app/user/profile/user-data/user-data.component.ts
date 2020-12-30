import { Component, Input, OnChanges, OnInit, SimpleChange } from '@angular/core';
import { UserFriendsAccessService } from 'src/app/data/api-access';
import { UserModel } from 'src/app/data/models/user.model';
import { NotificationService } from 'src/app/data/notification.service';

@Component({
  selector: 'user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.css']
})
export class UserDataComponent implements OnInit, OnChanges {
  @Input() displayedUser: UserModel;
  @Input() currentLoggedUserId: string;
  canAddFriend: boolean = false;
  canDeleteFriend: boolean = false;
  canAcceptFriend: boolean = false;
  constructor(private _friendAccess: UserFriendsAccessService,
    private _notificationAccess: NotificationService) { }

  ngOnChanges(){
    this.resetState();
    this.loadRelation();
  }
  ngOnInit(): void {
    this.loadRelation();
}
private resetState(){
  this.canAddFriend= false;
  this.canDeleteFriend = false;
  this.canAcceptFriend = false;
}
loadRelation(){
  this._friendAccess.getFriendRelation(this.currentLoggedUserId, this.displayedUser.id)
      .subscribe(result => {
        if (result) {
          this.canDeleteFriend = true;
        }
        else {
          this._notificationAccess.getNotification(this.currentLoggedUserId, this.displayedUser.id, 1)
            .subscribe(result => {
              if(result.collection.length>0){
                this.canAcceptFriend = true;
              }
              else{
                 this.canAddFriend=true;
              }
            })
        }
      })
  }
}