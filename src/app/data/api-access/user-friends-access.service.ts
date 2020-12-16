import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConnectionsConstants } from 'src/app/core/authorization/ConnectionsConstants';
import { DataAccessService } from '../api-service/data.service';
import { PaginationWithCollectionModel } from '../common/pagination-with-collection-model';
import { UserModel } from '../models/user.model';

@Injectable()
export class UserFriendsAccessService {

  constructor(private _apiAccess : DataAccessService) { }

  getFriends(userId: string) : Observable<PaginationWithCollectionModel<UserModel>> {
    return this._apiAccess.getCollection<UserModel>(`${ConnectionsConstants.apiRoot}users/${userId}/friends?pageSize=20`)
  }
  getNextFriends(url:string) : Observable<PaginationWithCollectionModel<UserModel>> {
    return this._apiAccess.getCollection<UserModel>(url)
  }
}
