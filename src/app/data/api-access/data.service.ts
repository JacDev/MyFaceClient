import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { PaginationWithCollectionModel } from '../../common/models/pagination-with-collection-model';
import { environment } from 'src/environments/environment';

@Injectable()
export class DataAccessService {

  constructor(private httpClient: HttpClient) { }

  getImage(imageUrl: string): Observable<Blob> {
    return this.httpClient.get(imageUrl, { responseType: 'blob' });
  }
  get<T>(url: string): Observable<T> {
    return this.httpClient.get<T>(url);
  }
  getCollection<T>(url: string): Observable<PaginationWithCollectionModel<T>> {
    return this.httpClient.get<PaginationWithCollectionModel<T>>(url);
  }
  post<T>(url: string, data: object): Observable<T> {
    return this.httpClient.post<T>(url, data);
  }
  postText<T>(url: string, data: object): Observable<string> {
    return this.httpClient.post(url, data, { responseType: 'text' });
  }
  patch<T>(url: string, data: object) {
    return this.httpClient.patch(url, data);
  }
  delete(url: string) {
    return this.httpClient.delete(url);
  }
}
