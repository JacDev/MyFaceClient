import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { AuthorizationService } from 'src/app/core/authorization/authorization.service';


@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
    constructor(private _authService: AuthorizationService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        //sprawdzenie, czy token jest dodawany do zapytania, w którym jest potrzebny
        return from(this._authService.getAccessToken().then(token => {
            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
            const authReq = req.clone({ headers });
            return next.handle(authReq).toPromise();
        }));
    }
}