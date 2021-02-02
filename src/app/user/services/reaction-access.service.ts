import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NotificationModel } from 'src/app/common/models';
import { environment } from '../../../environments/environment'
import { DataAccessService } from '../../data/api-access/data.service';
import { PostReactionModel } from '../models/post-reaction.model';

@Injectable({
  providedIn: 'root'
})
export class ReactionAccessService {

  constructor(private _apiAccess: DataAccessService) { }
  getPostReactions(userId: string, postId: string): Observable<PostReactionModel[]> {
    return this._apiAccess.get<PostReactionModel[]>(`${environment.apiRoot}users/${userId}/posts/${postId}/reactions`)
  }
  postPostReactions(userId: string, postId: string, fromWhoId: string): Observable<NotificationModel> {
    return this._apiAccess.post<NotificationModel>(`${environment.apiRoot}users/${userId}/posts/${postId}/reactions`, { 'fromWho': fromWhoId, 'reaction': 'like' })
  }
  deletePostReactions(userId: string, postId: string, fromWhoId: string): Observable<Object> {
    return this._apiAccess.delete(`${environment.apiRoot}users/${userId}/posts/${postId}/reactions/${fromWhoId}`)
  }
}
