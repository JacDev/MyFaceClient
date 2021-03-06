import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'
import { CurrentTimeService } from 'src/app/common/services/time.service';
import { DataAccessService } from '../../data/api-access/data.service';
import { PaginationWithCollectionModel } from '../../common/models/pagination-with-collection-model';
import { PostModel } from '../models/post.model';

@Injectable()
export class PostAccessService {

  constructor(private _apiAccess: DataAccessService,
    private _timeService: CurrentTimeService) { }

  getUserPosts(userId: string): Observable<PaginationWithCollectionModel<PostModel>> {
    return this._apiAccess.getCollection<PostModel>(`${environment.apiRoot}users/${userId}/posts`)
  }
  getUserNextPosts(url: string): Observable<PaginationWithCollectionModel<PostModel>> {
    return this._apiAccess.getCollection<PostModel>(url)
  }
  getFriendsPosts(userId: string): Observable<PaginationWithCollectionModel<PostModel>> {
    return this._apiAccess.getCollection<PostModel>(`${environment.apiRoot}users/${userId}/posts/latest`)
  }
  getFriendsNextPosts(url: string): Observable<PaginationWithCollectionModel<PostModel>> {
    return this._apiAccess.getCollection<PostModel>(url)
  }
  getPost(userId: string, postId: string): Observable<PostModel> {
    return this._apiAccess.get<PostModel>(`${environment.apiRoot}users/${userId}/posts/${postId}`)
  }
  patchPost(userId: string, postId: string, text: string): Observable<Object> {
    let jsonPatchDocument =
      [{
        "op": "replace",
        "path": "/text",
        "value": text
      }]
    return this._apiAccess.patch<Object>(`${environment.apiRoot}users/${userId}/posts/${postId}`, jsonPatchDocument);
  }
  deletePost(userId: string, postId: string) {
    return this._apiAccess.delete(`${environment.apiRoot}users/${userId}/posts/${postId}`)
  }
  postPost(userId: string, text: string, picture: File = null): Observable<PostModel> {
    let data = new FormData();
    data.append('text', text);
    data.append('whenAdded', this._timeService.getCurrentDate());
    data.append('picture', picture);
    return this._apiAccess.post<PostModel>(`${environment.apiRoot}users/${userId}/posts`, data);
  }
  setProfileImage(userId: string, postId: string) {
    return this._apiAccess.postText(`${environment.apiRoot}users/${userId}/posts/${postId}`, {});
  }
}
