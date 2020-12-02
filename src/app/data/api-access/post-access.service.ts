import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConnectionsConstants } from 'src/app/core/authorization/ConnectionsConstants';
import { DataAccessService } from '../api-service/data.service';
import { PostModel } from '../models/post.model';

@Injectable()
export class PostAccessService {

  constructor(private _apiAccess : DataAccessService) { }

  getUserPosts(userId: string) : Observable<PostModel[]> {
     return this._apiAccess.get<PostModel[]>(`${ConnectionsConstants.apiRoot}users/${userId}/posts`)
  }
  getPost(userId: string, postId: string) : Observable<PostModel>{
    return this._apiAccess.get<PostModel>(`${ConnectionsConstants.apiRoot}users/${userId}/posts/${postId}`)
  }
}
