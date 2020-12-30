import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MessageFromApiModel } from 'src/app/chat/data/message-from-api-model';
import { ConnectionsConstants } from 'src/app/core/authorization/ConnectionsConstants';
import { DataAccessService } from '../api-service/data.service';
import { PaginationWithCollectionModel } from '../common/pagination-with-collection-model';

@Injectable()
export class MessagesAccessService {

  constructor(private _apiAccess: DataAccessService) { }
  getNextMessages(url: string = null, skip?: number): Observable<PaginationWithCollectionModel<MessageFromApiModel>> {
    var currentUrl = url
    if (skip) {
      currentUrl += '&Skip=' + skip;
    }
    return this._apiAccess.getCollection<MessageFromApiModel>(currentUrl)
  }

  getMessages(userId: string, withWho: string): Observable<PaginationWithCollectionModel<MessageFromApiModel>> {
    return this._apiAccess.getCollection<MessageFromApiModel>(`${ConnectionsConstants.apiRoot}users/${userId}/messages/with/${withWho}`)
  }
  postMessage(userId: string, message: Object): Observable<MessageFromApiModel> {
    return this._apiAccess.post<MessageFromApiModel>(`${ConnectionsConstants.apiRoot}users/${userId}/messages`, message);
  }
}
