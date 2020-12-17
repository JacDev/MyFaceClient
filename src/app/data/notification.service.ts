import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HubService } from 'src/app/data/hub.service';

@Injectable()

export class NotificationService {
  private _newNotificationSubject = new Subject();
  public newNotification = this._newNotificationSubject.asObservable();

  constructor(private _hubService: HubService) { }

  ngOnInit(): void {
    this._hubService.newNotification.subscribe(_ => {
      this._newNotificationSubject.next();
      console.log('doszlo')
    })
  }
  sendNotification(toWhoId: string, type: string, when: Date, eventId: string) {
    this._hubService.sendNotification(toWhoId, type, when, eventId);
  }
}