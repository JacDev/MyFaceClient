import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConnectionsConstants } from 'src/app/core/authorization/ConnectionsConstants';
import { DataAccessService } from '../api-service/data.service';
import { PaginationWithCollectionModel } from '../common/pagination-with-collection-model';
import { PostModel } from '../models/post.model';

@Injectable()
export class PostAccessService {

  constructor(private _apiAccess: DataAccessService) { }

  getUserPosts(userId: string, url: string = null): Observable<PaginationWithCollectionModel<PostModel>> {
    var currentUrl = url || `${ConnectionsConstants.apiRoot}users/${userId}/posts`;
    return this._apiAccess.getCollection<PostModel>(currentUrl)
  }
  getFriendsPosts(userId: string, url: string = null): Observable<PaginationWithCollectionModel<PostModel>> {
    var currentUrl = url || `${ConnectionsConstants.apiRoot}users/${userId}/posts/latest`;
    return this._apiAccess.getCollection<PostModel>(currentUrl)
  }
  getPost(userId: string, postId: string): Observable<PostModel> {
    return this._apiAccess.get<PostModel>(`${ConnectionsConstants.apiRoot}users/${userId}/posts/${postId}`)
  }
  patchPost(userId: string, postId: string, jsonPatchDocument: Object): Observable<Object> {
    return this._apiAccess.patch<Object>(`${ConnectionsConstants.apiRoot}users/${userId}/posts/${postId}`, jsonPatchDocument);
  }
  deletePost(userId: string, postId: string) {
    return this._apiAccess.delete(`${ConnectionsConstants.apiRoot}users/${userId}/posts/${postId}`)
  }
  postPost(userId: string, post: Object): Observable<PostModel> {
    return (this._apiAccess.post<PostModel>(`${ConnectionsConstants.apiRoot}users/${userId}/posts`, post)) as Observable<PostModel>
  }
}
