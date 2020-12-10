import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from 'src/app/core/authorization/authorization-index';
import { UserFriendsAccessService } from 'src/app/data/api-access/api-access-index';
import { UserAccessService } from 'src/app/data/api-access/user-access.service';
import { PaginatiomModel } from 'src/app/data/common/pagination-model';
import { UserModel } from 'src/app/data/models/user.model';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  
  constructor(private hubConnection: ChatService,
    private _authService: AuthorizationService,
    private _userApiAccess: UserAccessService,
    private _friendsApiAccess: UserFriendsAccessService) {

  }
  public userFriends: UserModel[];
  paginationParams: PaginatiomModel;
  func() {
    this.hubConnection.sendMessage(this._authService.currentUserId, "aaaa")
  }


  ngOnInit(): void {
    if (this._authService.currentUser) {
      this.hubConnection.initConnection()
    }
    else {
      this._authService.userLoaded.subscribe(result => {
        this.hubConnection.initConnection()
      })
    }
    this.hubConnection.newMessage.subscribe(resutl => {
      this.displayNewMessage(resutl);
    })
    this.loadFriends();
  }
  loadFriends() {
    this._friendsApiAccess.getFriends(this._authService.currentUserId)
      .subscribe(
        result => {
          this.userFriends = result.collection;
          this.paginationParams = result.paginationMetadata;
          console.log(this.userFriends);
          console.log(this.paginationParams);
        },
        error => console.log('error', error)
      );
  }
  displayNewMessage(message) {
    console.log('from component', message);
  }

}
