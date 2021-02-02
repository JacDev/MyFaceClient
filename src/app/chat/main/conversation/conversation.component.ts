import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { MessagesService } from 'src/app/chat/services/messages.service';
import { PaginatiomModel } from 'src/app/common/models/pagination-model';
import { MessageToAddModel } from 'src/app/common/models/message-to-add.model';
import { UserModel } from 'src/app/common/models/user.model';
import { MessageModel } from '../../models/message.model';

@Component({
  selector: 'chat-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.css']
})
export class ConversationComponent implements OnInit {
  @ViewChildren('messagesList') messageElements: QueryList<any>;
  @Input() newMessageFromHub: Observable<MessageToAddModel>;
  @Input() userToDisplay: UserModel;
  @Input() currentLoggedUserId: string;
  @Output() newMessageEmitter: EventEmitter<MessageToAddModel> = new EventEmitter<MessageToAddModel>();

  public showWindow: boolean = false;
  public isLoadingNewMessages: boolean = false;
  public listOfMessagesFromApi: (MessageModel | MessageToAddModel)[] = null;
  public messagesPaginationParams: PaginatiomModel = null;
  public newMessageForm: FormGroup;
  public mesageText: FormControl;
  public screenHeight: number;
  private isAfterLoadingNewMessages: boolean = false;
  private isScrolled: boolean = false;
  private newMessagesToSkip: number = 0;
  public isNewMessage: boolean = false;
  public newUnseenMessages: number = 0;

  public showError: boolean = false;

  constructor(private _messageApiAccess: MessagesService) { }

  @ViewChild('messageBox') private messageBox: ElementRef;
  scrollToBottom() {
    if (!this.isScrolled) {
      try {
        this.messageBox.nativeElement.scrollTop = this.messageBox.nativeElement.scrollHeight;
        this.isScrolled = true;
      } catch (error) { this.showError = true }
    }
  }
  @HostListener('window:resize', ['$event'])
  getScreenSize(): void {
    this.screenHeight = window.innerHeight;
  }

  ngOnInit(): void {
    this.newMessageFromHub.subscribe(result => {
      this.reciveMessage(result);
    })
    this.mesageText = new FormControl();
    this.newMessageForm = new FormGroup({
      mesageText: this.mesageText
    })

  }
  reciveMessage(message: MessageToAddModel): void {
    if (this.userToDisplay.id == message.fromWho) {
      this.isNewMessage = true;
      this.newUnseenMessages++;
      if (this.listOfMessagesFromApi) {
        this.listOfMessagesFromApi.push(message);
      }
    }
  }
  loadMessages(): void {
    this.getScreenSize();
    this.isLoadingNewMessages = true;
    this._messageApiAccess.getMessages(this.currentLoggedUserId, this.userToDisplay.id)
      .subscribe(
        result => {
          this.isLoadingNewMessages = false
          this.listOfMessagesFromApi = result.collection.reverse();
          this.messagesPaginationParams = result.paginationMetadata;
        },
        error => this.showError = true
      );
  }
  showConversation(): void {
    this.newUnseenMessages = 0;
    this.isNewMessage = false;
    this.showWindow = !this.showWindow;
    this.loadMessages();
  }
  @HostListener("scroll", [])
  onScroll(event): void {
    if (this.topReached(event) && this.messagesPaginationParams.hasNext && !this.isLoadingNewMessages) {
      this.isLoadingNewMessages = true;
      this._messageApiAccess.getNextMessages(this.messagesPaginationParams.nextPageLink, this.newMessagesToSkip)
        .subscribe(
          result => {
            this.isAfterLoadingNewMessages = true;
            this.messagesPaginationParams = result.paginationMetadata;

            this.listOfMessagesFromApi.unshift(...result.collection.reverse());
            this.isLoadingNewMessages = false;
          },
          error => this.showError = true
        );
    }
  }
  topReached(event): boolean {
    return (event.target.scrollTop == 0);
  }
  addMessage(messageForm: FormGroup): void {
    if (!messageForm.value.mesageText || messageForm.value.mesageText.trim().length == 0) {
      messageForm.reset();
    }
    else {
      this.newMessagesToSkip++;
      this.isAfterLoadingNewMessages = false;
      const text = messageForm.value.mesageText.trimEnd()
      let messageToSend: MessageToAddModel = {
        text: text,
        toWho: this.userToDisplay.id,
        fromWho: this.currentLoggedUserId,
        when: new Date()
      }
      this.listOfMessagesFromApi.push(messageToSend);
      this.newMessageEmitter.emit(messageToSend)

      messageForm.reset();
    }
  }
  ngForRendred(): void {
    if (!this.isAfterLoadingNewMessages) {
      this.isScrolled = false;
      this.scrollToBottom()
    }
  }
  ngAfterViewInit(): void {
    this.messageElements.changes.subscribe(t => {
      this.ngForRendred();
    })
  }
}
