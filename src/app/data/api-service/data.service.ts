import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { PaginationWithCollectionModel } from '../common/pagination-with-collection-model';

@Injectable()
export class DataAccessService {

  constructor(private httpClient: HttpClient) { }

  get<T>(url: string) : Observable<T>{
    return this.httpClient.get<T>(url);
  }
  getCollection<T>(url: string) : Observable<PaginationWithCollectionModel<T>>{
    return this.httpClient.get<PaginationWithCollectionModel<T>>(url);
  }
  post<T>(url: string, data: T) {
    return this.httpClient.post(url, data);
  }
  patch<T>(url: string, data: T) {
    return this.httpClient.patch(url, data);
  }
  delete<T>(url: string) {
    return this.httpClient.delete(url);
  }
}