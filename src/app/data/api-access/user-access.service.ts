import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConnectionsConstants } from 'src/app/core/authorization/ConnectionsConstants';
import { DataAccessService } from '../api-service/data.service';
import { LoggedUser } from '../models/loggeduser.model';

@Injectable()
export class UserAccessService {

  constructor(private _apiAccess : DataAccessService) { }

  getUser(id: string) : Observable<LoggedUser> {
     return this._apiAccess.get<LoggedUser>(`${ConnectionsConstants.apiRoot}users/${id}`)
  }
}
