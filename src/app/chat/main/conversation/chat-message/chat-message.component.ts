import { Component, Input, OnInit } from '@angular/core';
import { MessageFromApiModel } from 'src/app/chat/data/message-from-api-model';

@Component({
  selector: 'chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.css']
})
export class ChatMessageComponent implements OnInit {
  @Input() messageToDisplay: MessageFromApiModel;
  @Input() currentLoggedUserId: string;
  public isLeft: boolean;
  constructor() { }

  ngOnInit(): void {
    this.isLeft = this.messageToDisplay.fromWho == this.currentLoggedUserId;
  }

}
