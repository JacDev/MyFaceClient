import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConnectionsConstants } from 'src/app/core/authorization/ConnectionsConstants';
import { DataAccessService } from '../api-service/data.service';

@Injectable()
export class ImageAccessService {

  constructor(private _apiAccess: DataAccessService) { }
  getImage(userId:string, imageUrl: string): Observable<Blob> {
    return this._apiAccess.getImage(`${ConnectionsConstants.apiRoot}users/${userId}/posts/image/${imageUrl}`);
  }
}