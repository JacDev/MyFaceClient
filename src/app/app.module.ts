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
  UserFriendsAccessService,
} from './data/api-access/index';
  
import { UserRouteActivator } from './user/shared/user/user-route-activator.service';
import { ImageAccessService } from './user/services/image-access.service';
import { IsLoggedInRouteGuard } from './core/guards/is-looged-in-route-guard';
import { MessagesAccessService } from './data/api-access/messages-api-access.service';
import { CommonModule } from '@angular/common';

import { CurrentTimeService } from './common/time.service';
import { SharedModule } from './shared.module';
import { ChatService } from './chat/services/chat.service';
import { HubService } from './data/hub.service';
import { NotificationService } from './data/notification.service';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SigninRedirectCallbackComponent,
    SignoutRedirectCallbackComponent, 
 
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule,
    FormsModule,
    SharedModule
  ],
  providers: [
    AuthorizationService,
    DataAccessService,
    UserAccessService,
    AuthInterceptorService,
    AuthorizationRouteGuard,
    IsLoggedInRouteGuard,
    UserFriendsAccessService,
    UserRouteActivator,
    ImageAccessService,
    MessagesAccessService,
    CurrentTimeService,
    ChatService,
    HubService,
    NotificationService,
    {provide : HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
