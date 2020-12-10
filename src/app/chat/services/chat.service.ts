import { Injectable } from '@angular/core';
import { AuthorizationService } from 'src/app/core/authorization/authorization-index';
import * as signalR from '@aspnet/signalr';
import { Subject } from 'rxjs';
import { MessageDbo } from '../data/messageDbo.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private connection: signalR.HubConnection;
  private _newMessageSubject = new Subject<MessageDbo>();
  public newMessage = this._newMessageSubject.asObservable();

  constructor(private _authService: AuthorizationService) {

  }

  initConnection() {
    this._authService.getAccessToken().then(result => {
      console.log(result);
      let tokenValue = '?token=' + result;
      this.connection = new signalR.HubConnectionBuilder().withUrl(`https://localhost:4999/messagesHub${tokenValue}`)   // mapping to the chathub as in startup.cs
        .configureLogging(signalR.LogLevel.Information)
        .build();
      this.connection.onclose(async (err) => {
        console.log(err)
        //await this.start();
      });
      this.connection.on("ReceiveMessage", (user, message) => { this.reciveMessage(user, message); });
      this.start();
    })
  }
  reciveMessage(fromWho: string, messageText: string) {
    let newMessage: MessageDbo = {
      toWhoId:this._authService.currentUserId,
      fromWhoId : fromWho,
      message : messageText,
    };

    this._newMessageSubject.next(newMessage);
    console.log('from hubconnector' + fromWho, messageText);
  }
  sendMessage(toWhoId: string, message: string) {
    this.connection.invoke("SendMessageToUser", toWhoId, message)
      .catch(function (err) {
        return console.error(err.toString());
      });
  }
  public async start() {
    try {
      await this.connection.start();
      console.log("connected");
    } catch (err) {
      console.log(err);
      //setTimeout(() => this.start(), 5000);
    }
  }
}