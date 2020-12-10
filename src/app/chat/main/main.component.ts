import { Component, HostListener, OnInit } from '@angular/core';
import { AuthorizationService } from 'src/app/core/authorization/authorization-index';
import { UserFriendsAccessService } from 'src/app/data/api-access/api-access-index';
import { UserAccessService } from 'src/app/data/api-access/user-access.service';
import { PaginatiomModel } from 'src/app/data/common/pagination-model';
import { UserModel } from 'src/app/data/models/user.model';
import { MessageFromApiModel } from '../data/message-from-api-model';
import { MessageDbo } from '../data/messageDbo.model';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  public currentLoggedUserId:string;


  
  constructor(private hubConnection: ChatService,
    private _authService: AuthorizationService,
    private _userApiAccess: UserAccessService,
    private _friendsApiAccess: UserFriendsAccessService) {

  }
  public userFriends: UserModel[];
  friendsPaginationParams: PaginatiomModel;
  sendMessage(event:MessageDbo) {
    this.hubConnection.sendMessage(event.toWho, event.text, event.when)
  }


  ngOnInit(): void {
    this.currentLoggedUserId = this._authService.currentUserId;
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
          this.userFriends = [result.collection[0]];
          this.friendsPaginationParams = result.paginationMetadata;
          console.log(this.userFriends);
          console.log(this.friendsPaginationParams);
        },
        error => console.log('error', error)
      );
  }
  displayNewMessage(message) {
    console.log('from component', message);
  }

  @HostListener("scroll", [])
  onScroll(event): void {
  //   //console.log(event);
  //   if (event.target.id == 'main-view') {
  //     if (this.bottomReached(event) && this.paginationParams.hasNext && !this.isLoadingNewPosts) {
  //       let newPosts: PostModel[] = null;
  //       this.isLoadingNewPosts = true;
  //       this._postAccess.getFriendsPosts(this._authService.currentUserId, this.paginationParams.nextPageLink)
  //         .subscribe(
  //           result => {
  //             newPosts = result.collection;
  //             this.paginationParams = result.paginationMetadata;

  //             this.listOfPostFromApi.push(...newPosts);
  //             console.log(this.listOfPostFromApi);
  //             console.log(this.paginationParams);
  //             this.isLoadingNewPosts = false;
  //           },
  //           error => console.log('error', error)
  //         );
  //     }
  //   }
  }
  bottomReached(event): boolean {
    return (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight - 110);
  }

}
