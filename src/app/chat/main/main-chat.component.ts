import { Component, HostListener, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
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
  templateUrl: './main-chat.component.html',
  styleUrls: ['./main-chat.component.css']
})
export class MainChatComponent implements OnInit {
  public currentLoggedUserId: string;
  public screenHeight: number;
  public userFriends: UserModel[];
  friendsPaginationParams: PaginatiomModel;

  private _newMessageSubject = new Subject<MessageDbo>();
  public newMessage = this._newMessageSubject.asObservable();
  isLoadingNewFriends: boolean = false;

  constructor(private hubConnection: ChatService,
    private _authService: AuthorizationService,
    private _friendsApiAccess: UserFriendsAccessService,
    private _usersApiAccess: UserAccessService) {
  }

  ngOnInit(): void {
    this.getScreenSize();
    this.currentLoggedUserId = this._authService.currentUserId;
    if (this._authService.currentUser) {
      this.hubConnection.initConnection();
      this.loadFriends();
    }
    else {
      this._authService.userLoaded.subscribe(result => {
        if (result) {
          this.hubConnection.initConnection();
          this.loadFriends();
        }
      })
    }
    this.hubConnection.newMessage.subscribe(resutl => {
      this._newMessageSubject.next(resutl);
      this.moveConversationToTop(resutl);
    })

  }
  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight;
  }
  @HostListener("scroll", [])
  onScroll(event): void {
    if (event.target.id == 'main-view') {
      if (this.bottomReached(event) && this.friendsPaginationParams.hasNext && !this.isLoadingNewFriends) {
        let newFriends: UserModel[] = null;
        this.isLoadingNewFriends = true;
        this._friendsApiAccess.getFriends(null, this.friendsPaginationParams.nextPageLink)
          .subscribe(
            result => {
              newFriends = result.collection;
              this.friendsPaginationParams = result.paginationMetadata;

              this.userFriends.unshift(...newFriends.reverse());
              console.log(this.userFriends);
              console.log(this.friendsPaginationParams);
              this.isLoadingNewFriends = false;
            },
            error => console.log('error', error)
          );
      }
    }
  }
  bottomReached(event): boolean {
    return (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight - 110);
  }
  sendMessage(event: MessageDbo) {
    this.hubConnection.sendMessage(event.toWho, event.text, event.when)
  }

  loadFriends() {
    this.isLoadingNewFriends = true;
    this._friendsApiAccess.getFriends(this._authService.currentUserId)
      .subscribe(
        result => {
          this.userFriends = result.collection;
          this.friendsPaginationParams = result.paginationMetadata;
          console.log(this.userFriends);
          console.log(this.friendsPaginationParams);
          this.isLoadingNewFriends = false;
        },
        error => console.log('error', error)
      );
  }

  moveConversationToTop(message: MessageDbo) {
    let x = this.userFriends.findIndex(x => x.id == message.fromWho)

    if (x > -1) {
      console.log('znaleziony')
      let user: UserModel = this.userFriends.find(x => x.id == message.fromWho);
      this.userFriends.splice(x, 1)
      this.userFriends.unshift(user);

    }
    else {
      this._usersApiAccess.getUser(message.fromWho)
        .subscribe(result => {
          this.userFriends.unshift(result);
        },
          error => console.log('error', error)
        );
    }
  }
}
