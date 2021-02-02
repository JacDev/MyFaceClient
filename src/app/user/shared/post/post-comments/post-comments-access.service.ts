import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CurrentTimeService } from 'src/app/common/services/time.service';
import { environment } from '../../../../../environments/environment'
import { DataAccessService } from '../../../../data/api-access/data.service';
import { PaginationWithCollectionModel } from '../../../../common/models/pagination-with-collection-model';
import { PostCommentModel } from '../../../models/post-comment.model';
import { PostCommentToAdd } from '../../../models/post-comment-to-add.model';

@Injectable()
export class PostCommentAccessService {

    constructor(private _apiAccess: DataAccessService,
        private _timeService: CurrentTimeService) { }

    getComments(userId: string, postId: string): Observable<PaginationWithCollectionModel<PostCommentModel>> {
        return this._apiAccess.getCollection<PostCommentModel>(`${environment.apiRoot}users/${userId}/posts/${postId}/comments`)
    }
    getNextComments(url: string): Observable<PaginationWithCollectionModel<PostCommentModel>> {
        return this._apiAccess.getCollection<PostCommentModel>(url)
    }
    postComment(userId: string, postId: string, text: string, fromWhoId: string): Observable<PostCommentModel> {
        let data: PostCommentToAdd = {
            text: text,
            fromWho: fromWhoId,
            whenAdded: this._timeService.getCurrentDate()
        }
        return this._apiAccess.post<PostCommentModel>(`${environment.apiRoot}users/${userId}/posts/${postId}/comments`, data);
    }
    deleteComment(userId: string, postId: string, commentId: string): Observable<Object> {
        return this._apiAccess.delete(`${environment.apiRoot}users/${userId}/posts/${postId}/comments/${commentId}`)
    }
    patchComment(userId: string, postId: string, commentId: string, text: string): Observable<Object> {
        const jsonPatchDocument = [{
            "op": "replace",
            "path": "/text",
            "value": text
        }]
        return this._apiAccess.patch(`${environment.apiRoot}users/${userId}/posts/${postId}/comments/${commentId}`, jsonPatchDocument)
    }

}
