import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { MessageDto } from 'src/app/common/models/messageDto.model';
import { MessagesAccessService } from 'src/app/data/api-access/messages-api-access.service';
import { PaginatiomModel } from 'src/app/data/common/pagination-model';
import { UserModel } from 'src/app/data/models/user.model';
import { MessageFromApiModel } from '../../data/message-from-api-model';

@Component({
  selector: 'chat-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.css']
})
export class ConversationComponent implements OnInit {
  @ViewChildren('messagesList') messageElements: QueryList<any>;
  @Input() newMessageFromHub: Observable<MessageDto>;
  @Input() userToDisplay: UserModel;
  @Input() currentLoggedUserId: string;
  @Input() userToShow: string;
  @Output() newMessageEmitter: EventEmitter<MessageDto> = new EventEmitter<MessageDto>();

  public showWindow: boolean = false;
  public isLoadingNewMessages: boolean = false;
  public listOfMessagesFromApi: (MessageFromApiModel | MessageDto)[] = null;
  public messagesPaginationParams: PaginatiomModel = null;
  public newMessageForm: FormGroup;
  public mesageText: FormControl;
  public screenHeight: number;
  isAfterLoadingNewMessages: boolean = false;
  isScrolled: boolean = false;
  newMessagesToSkip: number = 0;
  isNewMessage: boolean = false;
  public newUnseenMessages: number = 0;
  constructor(private _messageApiAccess: MessagesAccessService) { }

  @ViewChild('messageBox') private messageBox: ElementRef;
  scrollToBottom() {
    if (!this.isScrolled) {
      try {
        this.messageBox.nativeElement.scrollTop = this.messageBox.nativeElement.scrollHeight;
        this.isScrolled = true;
      } catch (err) { }
    }
  }
  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
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
  reciveMessage(message: MessageDto) {
    if (this.userToDisplay.id == message.fromWho) {
      this.isNewMessage = true;
      this.newUnseenMessages++;
      console.log("message from conversation");
      if (this.listOfMessagesFromApi) {
        this.listOfMessagesFromApi.push(message);
      }
    }
  }
  loadMessages() {
    this.getScreenSize();
    this.isLoadingNewMessages = true;
    this._messageApiAccess.getMessages(this.currentLoggedUserId, this.userToDisplay.id)
      .subscribe(
        result => {
          this.isLoadingNewMessages = false
          this.listOfMessagesFromApi = result.collection.reverse();
          this.messagesPaginationParams = result.paginationMetadata;
        },
        error => console.log('error', error)
      );
  }
  showConversation() {
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
          error => console.log('error', error)
        );
    }
  }
  topReached(event): boolean {
    return (event.target.scrollTop == 0);
  }
  addMessage(messageForm: FormGroup) {
    if (!messageForm.value.mesageText || messageForm.value.mesageText.trim().length == 0) {
      messageForm.reset();
    }
    else {
      this.newMessagesToSkip++;
      this.isAfterLoadingNewMessages = false;
      const text = messageForm.value.mesageText.trimEnd()
      let messageToSend: MessageDto = {
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

  ngForRendred() {
    if (!this.isAfterLoadingNewMessages) {
      this.isScrolled = false;
      this.scrollToBottom()
    }
  }
  ngAfterViewInit() {
    this.messageElements.changes.subscribe(t => {
      this.ngForRendred();
    })
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userToShow'].currentValue == this.userToDisplay.id) {
      this.showConversation()
    }
    else if (changes['userToShow'].previousValue == this.userToDisplay.id) {
      this.showConversation()
    }
  }
}
