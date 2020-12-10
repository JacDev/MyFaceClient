import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DataAccessService } from './data/api-service/data.service';

import { AuthInterceptorService } from './data/api-service/auth-interceptor.service';
import { NavbarComponent } from './navbar/navbar.component';
import { AuthorizationRouteGuard } from './core/guards/authorize-route-guard';


import {SignoutRedirectCallbackComponent, 
  SigninRedirectCallbackComponent, 
  AuthorizationService} from './core/authorization/authorization-index'

import { UserAccessService, 
  PostAccessService,UserFriendsAccessService,
  PostCommentAccessService,  
  ReactionAccessService} from './data/api-access/api-access-index';
  
import { VerticalNavbarComponent } from './vertical-navbar/vertical-navbar.component';
import { UserRouteActivator } from './user/shared/user/user-route-activator.service';
import { ImageAccessService } from './data/api-access/image-access.service';
import { IsLoggedInRouteGuard } from './core/guards/is-looged-in-route-guard';
import { MessagesAccessService } from './data/api-access/messages-api-access.service';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SigninRedirectCallbackComponent,
    SignoutRedirectCallbackComponent,
    VerticalNavbarComponent,  
 
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule,

  ],
  providers: [
    AuthorizationService,
    DataAccessService,
    UserAccessService,
    PostAccessService,
    AuthInterceptorService,
    AuthorizationRouteGuard,
    IsLoggedInRouteGuard,
    UserFriendsAccessService,
    UserRouteActivator,
    PostCommentAccessService,
    ReactionAccessService,
    ImageAccessService,
    MessagesAccessService,
    {provide : HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
