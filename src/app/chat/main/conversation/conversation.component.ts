import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MessagesAccessService } from 'src/app/data/api-access/messages-api-access.service';
import { PaginatiomModel } from 'src/app/data/common/pagination-model';
import { UserModel } from 'src/app/data/models/user.model';
import { MessageFromApiModel } from '../../data/message-from-api-model';
import { MessageDbo } from '../../data/messageDbo.model';

@Component({
  selector: 'chat-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.css']
})
export class ConversationComponent implements OnInit {
  @ViewChildren('messagesList') messageElements: QueryList<any>;

  @Input() userToDisplay: UserModel;
  @Input() currentLoggedUserId: string;
  @Output() newMessageEmitter: EventEmitter<MessageDbo> = new EventEmitter<MessageDbo>();

  public showWindow: boolean = false;
  public isLoadingNewMessages: boolean = false;
  public listOfMessagesFromApi: (MessageFromApiModel | MessageDbo)[];
  public messagesPaginationParams: PaginatiomModel = null;
  public newMessageForm: FormGroup;
  public mesageText: FormControl;
  public screenHeight: number;
  isAfterLoadingNewMessages: boolean = false;
  isScrolled: boolean = false;
  newMessagesToSkip: number = 0;

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
  constructor(private _messageApiAccess: MessagesAccessService) { }

  ngOnInit(): void {
    this.mesageText = new FormControl();
    this.newMessageForm = new FormGroup({
      mesageText: this.mesageText
    })

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
          console.log(this.listOfMessagesFromApi);
          console.log(this.messagesPaginationParams);
        },
        error => console.log('error', error)
      );
  }
  showConversation(withWhoId: string) {
    this.showWindow = !this.showWindow;
    this.loadMessages();
  }
  @HostListener("scroll", [])
  onScroll(event): void {
    if (event.target.id == 'main-view') {
      if (this.topReached(event) && this.messagesPaginationParams.hasNext && !this.isLoadingNewMessages) {
        let newPosts: MessageFromApiModel[] = null;
        this.isLoadingNewMessages = true;
        this._messageApiAccess.getNextMessages(this.messagesPaginationParams.nextPageLink, this.newMessagesToSkip)
          .subscribe(
            result => {
              this.isAfterLoadingNewMessages = true;
              newPosts = result.collection;
              this.messagesPaginationParams = result.paginationMetadata;

              this.listOfMessagesFromApi.unshift(...newPosts.reverse());
              console.log(this.listOfMessagesFromApi);
              console.log(this.messagesPaginationParams);
              this.isLoadingNewMessages = false;
            },
            error => console.log('error', error)
          );
      }
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
      let messageToSend: MessageDbo = {
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
}
