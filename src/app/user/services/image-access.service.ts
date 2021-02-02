import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'
import { DataAccessService } from '../../data/api-access/data.service';

@Injectable()
export class ImageAccessService {

  constructor(private _apiAccess: DataAccessService) { }
  getImage(userId: string, imageUrl: string): Observable<Blob> {
    return this._apiAccess.getImage(`${environment.apiRoot}users/${userId}/posts/image/${imageUrl}`);
  }
}