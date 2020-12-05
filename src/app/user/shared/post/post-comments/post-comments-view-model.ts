import { PaginationWithCollectionModel } from 'src/app/data/common/pagination-with-collection-model';
import { PostCommentModel } from 'src/app/data/models/post-comment.model';

export class PostCommentViewModel{
   paginationWithCollection: PaginationWithCollectionModel<PostCommentModel>;
}