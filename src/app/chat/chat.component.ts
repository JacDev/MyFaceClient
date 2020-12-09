import { Component, OnInit } from '@angular/core';

import * as signalR from '@aspnet/signalr';          // import signalR
import { HttpClient } from '@angular/common/http';
import { ConnectionsConstants } from '../core/authorization/ConnectionsConstants';
import { AuthorizationService } from '../core/authorization/authorization-index';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  private connection: any;

  constructor(private http: HttpClient,
    private _authService: AuthorizationService) {
    if (_authService.currentUser) {
      this.initConnection()
    }
    else {
      _authService.userLoaded.subscribe(result => {
        this.initConnection()
      })


    }
  }



  initConnection() {
    this._authService.getAccessToken().then(result => {
      console.log(result);
      let tokenValue = '?token=' + result;
      this.connection = new signalR.HubConnectionBuilder().withUrl(`https://localhost:4999/messagesHub${tokenValue}`)   // mapping to the chathub as in startup.cs
        .configureLogging(signalR.LogLevel.Information)
        .build();
      this.connection.onclose(async () => {
        await this.start();
      });
      this.connection.on("ReceiveOne", (user, message) => { this.mapReceivedMessage(user, message); });
      this.start();
    })
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
  private mapReceivedMessage(user: string, message: string): void {
    console.log(user);
  }


  ngOnInit(): void {
  }

}
