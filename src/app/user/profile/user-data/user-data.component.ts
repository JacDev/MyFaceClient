import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { NotificationDto } from 'src/app/common/models/notificationDto.model';
import { CurrentTimeService } from 'src/app/common/time.service';
import { UserFriendsAccessService } from 'src/app/data/api-access';
import { FriendsRelationToAddModel } from 'src/app/data/models/friends-relation-to-add.model';
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
  canCancelFriendRequiest: boolean = false;
  notification: NotificationDto = null;

  constructor(private _friendsService: UserFriendsAccessService,
    private _notificationAccess: NotificationService,
    private _timeService: CurrentTimeService) { }

  ngOnChanges() {
    this.resetState();
    this.loadRelation();
  }
  ngOnInit(): void {
    this.loadRelation();
  }
  private resetState() {
    this.canAddFriend = false;
    this.canDeleteFriend = false;
    this.canAcceptFriend = false;
    this.canCancelFriendRequiest = false;
  }
  loadRelation() {
    this._friendsService.getFriendRelation(this.currentLoggedUserId, this.displayedUser.id)
      .subscribe(areFriends => {
        if (areFriends) {
          this.canDeleteFriend = true;
        }
        else {
          this._notificationAccess.getNotification(this.currentLoggedUserId, this.displayedUser.id, 1)
            .subscribe(gotInvitation => {
              if (gotInvitation.collection.length > 0) {
                this.notification = gotInvitation.collection[0];
                this.canAcceptFriend = true;
              }
              else {
                this._notificationAccess.getNotification(this.displayedUser.id, this.currentLoggedUserId, 1)
                  .subscribe(invited => {
                    if (invited.collection.length > 0) {
                      this.notification = invited.collection[0];
                      this.canCancelFriendRequiest = true;
                    }
                    else {
                      this.canAddFriend = true;
                    }
                  })
              }
            })
        }
      })
  }
  sendFriendRequiest() {
    this._notificationAccess.sendNotification(this.displayedUser.id, "friendRequiest", this._timeService.getCurrentDate(), this.displayedUser.id);
    this.canAddFriend = false;
    this.canCancelFriendRequiest = true;
  }
  acceptFriendRequiest() {
    let newRelation: FriendsRelationToAddModel = {
      friendId: this.displayedUser.id,
      sinceWhen: this._timeService.getCurrentDate()
    }
    this._friendsService.addFriend(this.currentLoggedUserId, newRelation)
      .subscribe(() => {
        this.canAcceptFriend = false;
        this.canDeleteFriend = true;
        this._notificationAccess.deleteNotification(this.displayedUser.id, this.notification.id)
          .subscribe()
        this._notificationAccess.sendNotification(this.displayedUser.id, "friendRequiestAccepted", this._timeService.getCurrentDate(), this.displayedUser.id);
      });
  }
  deleteFriend() {
    this._friendsService.deleteFriend(this.currentLoggedUserId, this.displayedUser.id)
      .subscribe(() => {
        this.canDeleteFriend = false;
        this.canAddFriend = true;
      })
  }
  undoFriendRequiest() {
    console.log(this.notification)
    if (this.notification == null) {
      this._notificationAccess.getNotification(this.currentLoggedUserId, this.displayedUser.id, 1)
        .subscribe(notifications => {
          if (notifications.collection.length > 0) {
            this.deleteFriendRequest();
          }
          else {
            this._notificationAccess.getNotification(this.displayedUser.id, this.currentLoggedUserId, 1)
              .subscribe(notifications => {
                this.notification = notifications.collection[0];
                this.deleteFriendRequest();
              })
          }
        })
    }
    else {
      this.deleteFriendRequest()
    }
  }
  private deleteFriendRequest() {
    this._notificationAccess.deleteNotification(this.currentLoggedUserId, this.notification.id)
      .subscribe(() => {
        this.canCancelFriendRequiest = false;
        this.canAddFriend = true;
        this.notification = null;
      })
  }
}