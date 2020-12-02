import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DataAccessService } from './data/api-service/data.service';
import { UserAccessService } from './data/api-access/user-access.service';
import { AuthInterceptorService } from './data/api-service/auth-interceptor.service';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { AuthorizationRouteGuard } from './core/guards/authorize-route-guard';
import { PostComponent } from './post/post.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { PostAccessService } from './data/api-access/post-access.service';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import {SignoutRedirectCallbackComponent, SigninRedirectCallbackComponent, AuthorizationService} from './core/authorization/authorization-index';
import { FriendsComponent } from './friends/friends.component'


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    SigninRedirectCallbackComponent,
    SignoutRedirectCallbackComponent,
    PostComponent,
    FriendsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule
  ],
  providers: [
    AuthorizationService,
    DataAccessService,
    UserAccessService,
    PostAccessService,
    AuthInterceptorService,
    DataAccessService,
    AuthorizationRouteGuard,
    {provide : HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
