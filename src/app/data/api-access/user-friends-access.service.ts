import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'
import { DataAccessService } from './data.service';
import { PaginationWithCollectionModel } from '../../common/models/pagination-with-collection-model';
import { FriendsRelationToAddModel } from '../../common/models/friends-relation-to-add.model';
import { FriendsRelationModel } from '../../common/models/friends-relation.model';
import { UserModel } from '../../common/models/user.model';

@Injectable()
export class UserFriendsAccessService {

  constructor(private _apiAccess: DataAccessService) { }

  addFriend(userId: string, relationToAdd: FriendsRelationToAddModel): Observable<FriendsRelationModel> {
    return this._apiAccess.post<FriendsRelationModel>(`${environment.apiRoot}users/${userId}/friends`, relationToAdd);
  }
  getFriends(userId: string): Observable<PaginationWithCollectionModel<UserModel>> {
    return this._apiAccess.getCollection<UserModel>(`${environment.apiRoot}users/${userId}/friends?pageSize=20`)
  }
  getNextFriends(url: string): Observable<PaginationWithCollectionModel<UserModel>> {
    return this._apiAccess.getCollection<UserModel>(url)
  }
  getFriendRelation(userId: string, friendId: string) {
    return this._apiAccess.get<FriendsRelationModel>(`${environment.apiRoot}users/${userId}/friends/${friendId}`)
  }
  deleteFriend(userId: string, friendId: string) : Observable<Object> {
    return this._apiAccess.delete(`${environment.apiRoot}users/${userId}/friends/${friendId}`)
  }
}