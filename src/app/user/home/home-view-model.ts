import { PaginationWithCollectionModel } from 'src/app/data/common/pagination-with-collection-model';
import { PostModel } from 'src/app/data/models/post.model';

export class HomeViewModel{
   paginationWithCollection: PaginationWithCollectionModel<PostModel>;
}