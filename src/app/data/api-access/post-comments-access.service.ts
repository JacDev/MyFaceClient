import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConnectionsConstants } from 'src/app/core/authorization/ConnectionsConstants';
import { DataAccessService } from '../api-service/data.service';
import { PaginationWithCollectionModel } from '../common/pagination-with-collection-model';
import { PostCommentModel } from '../models/post-comment.model';

@Injectable()
export class PostCommentAccessService {

    constructor(private _apiAccess: DataAccessService) { }

    getComments(userId: string, postId: string, url: string = null): Observable<PaginationWithCollectionModel<PostCommentModel>> {
        var currentUrl = url || `${ConnectionsConstants.apiRoot}users/${userId}/posts/${postId}/comments`;
        return this._apiAccess.getCollection<PostCommentModel>(currentUrl)
    }
    postComment(userId: string, postId: string, comment: Object): Observable<PostCommentModel> {
        return (this._apiAccess.post<PostCommentModel>(`${ConnectionsConstants.apiRoot}users/${userId}/posts/${postId}/comments`, comment)) as Observable<PostCommentModel>
    }
    deleteComment(userId: string, postId: string, commentId: string): Observable<Object> {
        return this._apiAccess.delete(`${ConnectionsConstants.apiRoot}users/${userId}/posts/${postId}/comments/${commentId}`)
    }
    patchComment(userId: string, postId: string, commentId: string, text: Object): Observable<Object> {
        return this._apiAccess.patch(`${ConnectionsConstants.apiRoot}users/${userId}/posts/${postId}/comments/${commentId}`, text)
    }

}
