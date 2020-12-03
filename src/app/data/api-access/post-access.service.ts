import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConnectionsConstants } from 'src/app/core/authorization/ConnectionsConstants';
import { DataAccessService } from '../api-service/data.service';
import { PaginationWithCollectionModel } from '../common/pagination-with-collection-model';
import { PostModel } from '../models/post.model';

@Injectable()
export class PostAccessService {

  constructor(private _apiAccess : DataAccessService) { }

  getUserPosts(userId: string, url:string = null) : Observable<PaginationWithCollectionModel<PostModel>> {
    var currentUrl = url || `${ConnectionsConstants.apiRoot}users/${userId}/posts`;
    return this._apiAccess.getCollection<PostModel>(currentUrl)
  }
  getFriendsPosts(userId: string, url:string = null) : Observable<PaginationWithCollectionModel<PostModel>> {
    var currentUrl = url || `${ConnectionsConstants.apiRoot}users/${userId}/posts/latest`;
    return this._apiAccess.getCollection<PostModel>(currentUrl)
  }
  getPost(userId: string, postId: string) : Observable<PostModel>{
    return this._apiAccess.get<PostModel>(`${ConnectionsConstants.apiRoot}users/${userId}/posts/${postId}`)
  }
}
