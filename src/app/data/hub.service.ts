import { Injectable } from '@angular/core';
import { AuthorizationService } from 'src/app/core/authorization/authorization-index';
import * as signalR from '@aspnet/signalr';
import { Subject } from 'rxjs';
import { MessageDto } from '../common/models/messageDto.model';

@Injectable()
export class HubService {

  private connection: signalR.HubConnection;
  private _newMessageSubject = new Subject<MessageDto>();
  public newMessage = this._newMessageSubject.asObservable();
  private _newNotificationSubject = new Subject();
  public newNotification = this._newNotificationSubject.asObservable();

  constructor(private _authService: AuthorizationService) { }

  initConnection() {
    this._authService.userLoaded
      .subscribe(_ => {
        this._authService.getAccessToken().then(result => {
          let tokenValue = '?token=' + result;
          this.connection = new signalR.HubConnectionBuilder().withUrl(`https://localhost:4999/notificationHub${tokenValue}`)   // mapping to the chathub as in startup.cs
            .configureLogging(signalR.LogLevel.Information)
            .build();
          this.connection.onclose(async (err) => {
            console.log(err)
            //await this.start();
          });
          this.connection.on("ReceiveMessage", (user, message, when) => { this.reciveMessage(user, message, when); });
          this.connection.on("ReceiveNotification", _ => { this.receiveNotification() })
          this.start();
        })
      })
  }
  receiveNotification() {
    console.log('z huba')
    this.newNotification.subscribe(_=>{
      console.log('dzial')

    })
    this._newNotificationSubject.next();
   

  }
  reciveMessage(fromWho: string, messageText: string, when: Date) {
    let newMessage: MessageDto = {
      toWho: this._authService.currentUserId,
      fromWho: fromWho,
      text: messageText,
      when: when
    };

    this._newMessageSubject.next(newMessage);
    console.log('from hubconnector' + fromWho, messageText);
  }
  sendMessage(toWhoId: string, message: string, when: Date) {
    this.connection.invoke("SendMessageToUser", toWhoId, message, when)
      .catch(function (err) {
        return console.error(err.toString());
      });
  }
  sendNotification(toWhoId: string, type: string, when: Date, eventId: string) {
    this.connection.invoke("SendNotificationToUser", toWhoId, type, when, eventId)
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