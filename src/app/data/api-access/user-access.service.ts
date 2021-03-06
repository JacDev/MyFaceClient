import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'
import { DataAccessService } from './data.service';
import { PaginationWithCollectionModel } from '../../common/models/pagination-with-collection-model';
import { UserModel } from '../../common/models/user.model';

@Injectable()
export class UserAccessService {

  constructor(private _apiAccess : DataAccessService) { }

  getUser(id: string) : Observable<UserModel> {
     return this._apiAccess.get<UserModel>(`${environment.apiRoot}users/${id}`)
  }
  getUsersWith(query:string, url:string=null) : Observable<PaginationWithCollectionModel<UserModel>> {
   var currentUrl = url || `${environment.apiRoot}users/find?searchName=${query.toLocaleLowerCase()}`;
    return this._apiAccess.get<PaginationWithCollectionModel<UserModel>>(currentUrl);
 }
}