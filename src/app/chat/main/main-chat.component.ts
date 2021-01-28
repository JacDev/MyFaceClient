import { Component, HostListener, Input, OnInit, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { MessageDto } from 'src/app/common/models/messageDto.model';
import { AuthorizationService } from 'src/app/core/authorization/authorization-index';
import { UserFriendsAccessService } from 'src/app/data/api-access';
import { UserAccessService } from 'src/app/data/api-access/user-access.service';
import { PaginatiomModel } from 'src/app/data/common/pagination-model';
import { UserModel } from 'src/app/data/models/user.model';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-main',
  templateUrl: './main-chat.component.html'
})
export class MainChatComponent implements OnInit {
  @Input() userIdToOpen;
  public currentLoggedUserId: string;
  public screenHeight: number;
  public userFriends: UserModel[] = null;
  friendsPaginationParams: PaginatiomModel;

  private _newMessageSubject = new Subject<MessageDto>();
  public newMessage = this._newMessageSubject.asObservable();
  isLoadingNewFriends: boolean = false;

  constructor(private _chatService: ChatService,
    private _authService: AuthorizationService,
    private _friendsApiAccess: UserFriendsAccessService,
    private _usersApiAccess: UserAccessService) {
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.userIdToOpen && this.userFriends) {
      this.moveConversationToTheTop(this.userIdToOpen)
    }
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
      })
    }
    this._chatService.newMessage.subscribe(result => {
      this._newMessageSubject.next(result);
      this.moveConversationToTheTop(result.fromWho);
    })
  }
  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
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
          error => console.log('error', error)
        );
    }
  }
  bottomReached(event): boolean {
    return (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight - 110);
  }
  sendMessage(event: MessageDto) {
    this._chatService.sendMessage(event.toWho, event.text, event.when)
  }
  loadFriends() {
    this.isLoadingNewFriends = true;
    this._friendsApiAccess.getFriends(this.currentLoggedUserId)
      .subscribe(
        result => {
          this.userFriends = result.collection;
          this.friendsPaginationParams = result.paginationMetadata;
          this.isLoadingNewFriends = false;
          if (this.userIdToOpen) {
            this.moveConversationToTheTop(this.userIdToOpen)
          }
        },
        error => console.log('error', error)
      );
  }
  moveConversationToTheTop(fromWho: string) {
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
          error => console.log('error', error)
        );
    }
  }
}