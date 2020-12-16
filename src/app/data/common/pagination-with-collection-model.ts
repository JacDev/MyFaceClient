import { PaginatiomModel } from './pagination-model';

export class PaginationWithCollectionModel<T>{
    paginationMetadata: PaginatiomModel;
    collection: Array<T>;
}