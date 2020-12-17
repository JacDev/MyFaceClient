import { Injectable, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { MessageDto } from 'src/app/common/models/messageDto.model';
import { HubService } from 'src/app/data/hub.service';

@Injectable()
export class ChatService implements OnInit {
  private _newMessageSubject = new Subject<MessageDto>();
  public newMessage = this._newMessageSubject.asObservable();

  constructor(private _notificationService: HubService) { }

  ngOnInit(): void {
    this._notificationService.newMessage.subscribe(message => {
      this._newMessageSubject.next(message);
    })

  }
  sendMessage(toWhoId: string, message: string, when: Date) {
    this._notificationService.sendMessage(toWhoId, message, when);
  }
}