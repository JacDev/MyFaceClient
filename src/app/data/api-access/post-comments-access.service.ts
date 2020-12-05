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
}
