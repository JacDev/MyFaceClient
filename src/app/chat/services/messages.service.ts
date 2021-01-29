import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MessageModel } from 'src/app/chat/models/message.model';
import { ConnectionsConstants } from 'src/app/core/authorization/ConnectionsConstants';
import { MessageToAddModel } from 'src/app/common/models/message-to-add.model';
import { DataAccessService } from '../../data/api-access/data.service';
import { PaginationWithCollectionModel } from '../../common/models/pagination-with-collection-model';

@Injectable()
export class MessagesService {

  constructor(private _apiAccess: DataAccessService) { }
  getNextMessages(url: string = null, skip?: number): Observable<PaginationWithCollectionModel<MessageModel>> {
    var currentUrl = url
    if (skip) {
      currentUrl += '&Skip=' + skip;
    }
    return this._apiAccess.getCollection<MessageModel>(currentUrl)
  }

  getMessages(userId: string, withWho: string): Observable<PaginationWithCollectionModel<MessageModel>> {
    return this._apiAccess.getCollection<MessageModel>(`${ConnectionsConstants.apiRoot}users/${userId}/messages/with/${withWho}`)
  }
  postMessage(userId: string, message: MessageToAddModel): Observable<MessageModel> {
    return this._apiAccess.post<MessageModel>(`${ConnectionsConstants.apiRoot}users/${userId}/messages`, message);
  }
}
