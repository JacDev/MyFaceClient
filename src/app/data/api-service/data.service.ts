import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { PaginationWithCollectionModel } from '../common/pagination-with-collection-model';

@Injectable()
export class DataAccessService {

  constructor(private httpClient: HttpClient) { }
  
  getImage(imageUrl: string): Observable<Blob> {
    return this.httpClient.get(imageUrl, { responseType: 'blob' });
  }
  get<T>(url: string) : Observable<T>{
    return this.httpClient.get<T>(url);
  }
  getCollection<T>(url: string) : Observable<PaginationWithCollectionModel<T>>{
    return this.httpClient.get<PaginationWithCollectionModel<T>>(url);
  }
  post<T>(url: string, data: Object | Object): Observable<T> {
    return this.httpClient.post<T>(url, data);
  }
  patch<T>(url: string, data: Object) {
    return this.httpClient.patch(url, data);
  }
  delete(url: string) {
    return this.httpClient.delete(url);
  }
}
