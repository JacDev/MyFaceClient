import { Injectable } from '@angular/core';
import { AuthorizationService } from 'src/app/core/authorization/index';
import * as signalR from '@aspnet/signalr';
import { Subject } from 'rxjs';
import { MessageToAddModel } from '../common/models/message-to-add.model';
import { environment } from '../../environments/environment'

@Injectable()
export class HubService {
  private connection: signalR.HubConnection;
  private _newMessageSubject = new Subject<MessageToAddModel>();
  public newMessage = this._newMessageSubject.asObservable();

  private _newNotificationSubject = new Subject();
  public newNotification = this._newNotificationSubject.asObservable();

  constructor(private _authService: AuthorizationService) { }

  initConnection() {
    this._authService.userLoaded
      .subscribe(_ => {
        this._authService.getAccessToken().then(result => {
          let tokenValue = '?token=' + result;
          this.connection = new signalR.HubConnectionBuilder().withUrl(`${environment.hubRoot}${tokenValue}`)
            .configureLogging(signalR.LogLevel.None)
            .build();
          this.connection.onclose(async (err) => {
            await this.start();
          });
          this.connection.on("ReceiveMessage", (user, message, when) => { this.reciveMessage(user, message, when); });
          this.connection.on("ReceiveNotification", _ => { this.receiveNotification() })
          this.start();
        })
      })
  }
  receiveNotification() {
    this._newNotificationSubject.next();
  }
  reciveMessage(fromWho: string, messageText: string, when: Date) {
    let newMessage: MessageToAddModel = {
      toWho: this._authService.currentUserId,
      fromWho: fromWho,
      text: messageText,
      when: when
    };

    this._newMessageSubject.next(newMessage);
  }
  sendMessage(toWhoId: string, message: string, when: Date): boolean {
    let res: boolean = true;
    this.connection.invoke("SendMessageToUser", toWhoId, message, when)
      .then(_ => {
        res = true;
      })
      .catch(function (err) {
        res = false;
      });
    return res;
  }
  sendNotification(toWhoId: string, type: string, when: string, eventId: string): boolean {
    let res: boolean = true;
    this.connection.invoke("SendNotificationToUser", toWhoId, type, when, eventId)
      .then(_ => {
        res = true;
      })
      .catch(function (err) {
        res = false;
      });
    return res;
  }

  public async start() {
    try {
      await this.connection.start();
    } catch (err) {
      setTimeout(() => this.start(), 3000);
    }
  }
}
