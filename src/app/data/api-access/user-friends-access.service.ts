import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConnectionsConstants } from 'src/app/core/authorization/ConnectionsConstants';
import { DataAccessService } from '../api-service/data.service';
import { PaginationWithCollectionModel } from '../common/pagination-with-collection-model';
import { UserModel } from '../models/user.model';

@Injectable()
export class UserFriendsAccessService {

  constructor(private _apiAccess : DataAccessService) { }

  getFriends(userId: string, url:string = null) : Observable<PaginationWithCollectionModel<UserModel>> {
    var currentUrl = url || `${ConnectionsConstants.apiRoot}users/${userId}/friends?pageSize=20`;
    return this._apiAccess.getCollection<UserModel>(currentUrl)
  }
}
