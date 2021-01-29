import { Component, Input, OnInit } from '@angular/core';
import { MessageModel } from 'src/app/chat/models/message.model';

@Component({
  selector: 'chat-message',
  templateUrl: './chat-message.component.html'
})
export class ChatMessageComponent implements OnInit {
  @Input() messageToDisplay: MessageModel;
  @Input() currentLoggedUserId: string;
  public isLeft: boolean;
  constructor() { }

  ngOnInit(): void {
    this.isLeft = this.messageToDisplay.fromWho == this.currentLoggedUserId;
  }

}
