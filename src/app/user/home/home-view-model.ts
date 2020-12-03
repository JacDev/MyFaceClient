import { PaginatiomModel } from '../data/common/pagination-model';
import { PaginationWithCollectionModel } from '../data/common/pagination-with-collection-model';
import { PostModel } from '../data/models/post.model';

export class HomeViewModel{
   paginationWithCollection: PaginationWithCollectionModel<PostModel>;
}