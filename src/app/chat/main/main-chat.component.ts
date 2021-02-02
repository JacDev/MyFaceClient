import { Component, HostListener, Input, OnInit, SimpleChanges } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AuthorizationService } from 'src/app/core/authorization/index';
import { UserFriendsAccessService } from 'src/app/data/api-access';
import { UserAccessService } from 'src/app/data/api-access/user-access.service';
import { PaginatiomModel } from 'src/app/common/models/pagination-model';
import { MessageToAddModel } from 'src/app/common/models/message-to-add.model';
import { UserModel } from 'src/app/common/models/user.model';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'chat-main',
  templateUrl: './main-chat.component.html'
})
export class MainChatComponent implements OnInit {
  public currentLoggedUserId: string;
  public screenHeight: number;
  public userFriends: UserModel[] = null;
  private friendsPaginationParams: PaginatiomModel;

  private _newMessageSubject = new Subject<MessageToAddModel>();
  public newMessage: Observable<MessageToAddModel> = this._newMessageSubject.asObservable();
  public isLoadingNewFriends: boolean = false;

  public showError: boolean = false;

  constructor(private _chatService: ChatService,
    private _authService: AuthorizationService,
    private _friendsApiAccess: UserFriendsAccessService,
    private _usersApiAccess: UserAccessService) {
  }

  ngOnInit(): void {
    this.getScreenSize();

    if (this._authService.currentUserId) {
      this.currentLoggedUserId = this._authService.currentUserId;
      this.loadFriends();
    }
    else {
      this._authService.userLoaded.subscribe(() => {
        this.currentLoggedUserId = this._authService.currentUserId;
        this.loadFriends();
      },
        error => this.showError = true)
    }
    this._chatService.newMessage.subscribe(result => {
      this._newMessageSubject.next(result);
      this.moveConversationToTheTop(result.fromWho);
    },
      error => this.showError = true)
  }
  @HostListener('window:resize', ['$event'])
  getScreenSize(): void {
    this.screenHeight = window.innerHeight;
  }
  @HostListener("scroll", [])
  onScroll(event): void {
    if (this.bottomReached(event) && this.friendsPaginationParams.hasNext && !this.isLoadingNewFriends) {
      this.isLoadingNewFriends = true;
      this._friendsApiAccess.getNextFriends(this.friendsPaginationParams.nextPageLink)
        .subscribe(
          result => {
            this.friendsPaginationParams = result.paginationMetadata;
            this.userFriends.unshift(...result.collection.reverse());
            this.isLoadingNewFriends = false;
          },
          error => this.showError = true
        );
    }
  }
  bottomReached(event): boolean {
    return (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight - 110);
  }
  sendMessage(event: MessageToAddModel): void {
    this._chatService.sendMessage(event.toWho, event.text, event.when)
  }
  loadFriends(): void {
    this.isLoadingNewFriends = true;
    this._friendsApiAccess.getFriends(this.currentLoggedUserId)
      .subscribe(
        result => {
          this.userFriends = result.collection;
          this.friendsPaginationParams = result.paginationMetadata;
          this.isLoadingNewFriends = false;
        },
        error => this.showError = true
      );
  }
  moveConversationToTheTop(fromWho: string): void {
    let x = this.userFriends.findIndex(x => x.id == fromWho)

    if (x > -1) {
      let user: UserModel = this.userFriends.find(x => x.id == fromWho);
      this.userFriends.splice(x, 1)
      this.userFriends.unshift(user);
    }
    else {
      this._usersApiAccess.getUser(fromWho)
        .subscribe(result => {
          this.userFriends.unshift(result);
        },
          error => this.showError = true
        );
    }
  }
}