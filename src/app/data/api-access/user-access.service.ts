import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConnectionsConstants } from 'src/app/core/authorization/ConnectionsConstants';
import { DataAccessService } from '../api-service/data.service';
import { UserModel } from '../models/user.model';

@Injectable()
export class UserAccessService {

  constructor(private _apiAccess : DataAccessService) { }

  getUser(id: string) : Observable<UserModel> {
     return this._apiAccess.get<UserModel>(`${ConnectionsConstants.apiRoot}users/${id}`)
  }
}
