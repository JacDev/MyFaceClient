import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HubService } from 'src/app/data/hub.service';
import { NotificationModel } from '../common/models/notification.model';
import { environment } from '../../environments/environment'
import { DataAccessService } from './api-access/data.service';
import { PaginationWithCollectionModel } from '../common/models/pagination-with-collection-model';

@Injectable()

export class NotificationService {
  private _newNotificationSubject = new Subject();
  public newNotification = this._newNotificationSubject.asObservable();

  constructor(private _hubService: HubService,
    private _apiAccess: DataAccessService) {
    this._hubService.newNotification.subscribe(() => {
      this._newNotificationSubject.next();
    })
  }

  markNotificationAsSeen(userId: string, notificationId: string): Observable<Object> {
    let jsonPatchDocument =
      [{
        "op": "replace",
        "path": "/HasSeen",
        "value": true
      }]
    return this._apiAccess.patch<Object>(`${environment.apiRoot}users/${userId}/notifications/${notificationId}`, jsonPatchDocument);
  }
  sendNotification(toWhoId: string, type: string, when: string, eventId: string) {
    this._hubService.sendNotification(toWhoId, type, when, eventId);
  }
  getNotification(userId: string, fromWhoId: string = null, notificationType: number = 0, eventId : string = null): Observable<PaginationWithCollectionModel<NotificationModel>> {
    var currentUrl = `${environment.apiRoot}users/${userId}/notifications`
    let alreadyAddedQuery: boolean = false;
    if (fromWhoId) {
      currentUrl += '?fromWhoId=' + fromWhoId;
      alreadyAddedQuery = true;
    }
    if (notificationType != 0) {
      if (!alreadyAddedQuery) {
        currentUrl += '?'
      }
      else {
        currentUrl += '&'
      }
      currentUrl += 'notificationType=' + notificationType;
    }
    if (eventId) {
      if (!alreadyAddedQuery) {
        currentUrl += '?'
      }
      else {
        currentUrl += '&'
      }
      currentUrl += 'eventId=' + eventId;
    }
    return this._apiAccess.getCollection<NotificationModel>(currentUrl)
  }
  getNotifications(userId: string): Observable<PaginationWithCollectionModel<NotificationModel>> {
    return this._apiAccess.getCollection<NotificationModel>(`${environment.apiRoot}users/${userId}/notifications`)
  }
  getNextNotifications(url: string = null, skip?: number): Observable<PaginationWithCollectionModel<NotificationModel>> {
    var currentUrl = url
    if (skip) {
      currentUrl += '&Skip=' + skip;
    }
    return this._apiAccess.getCollection<NotificationModel>(currentUrl)
  }
  deleteNotification(userId: string, notificationId: string): Observable<Object> {
    return this._apiAccess.delete(`${environment.apiRoot}users/${userId}/notifications/${notificationId}`)
  }
}