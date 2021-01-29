import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DataAccessService } from './data/api-access/data.service';

import { NavbarComponent } from './navbar/navbar.component';
import { AuthorizationRouteGuard } from './core/guards/authorize-route-guard';


import {
  SignoutRedirectCallbackComponent,
  SigninRedirectCallbackComponent,
  AuthorizationService,
  AuthInterceptorService
} from './core/authorization/index'

import {
  UserAccessService,
  UserFriendsAccessService,
} from './data/api-access/index';

import { SharedModule } from './shared.module';
import { HubService } from './data/hub.service';
import { NotificationService } from './data/notification.service';
import { NotificationComponent } from './navbar/notification/notification.component';
import { RedirectComponent } from './common/redirect/redirect.component';
import { EmptyComponent } from './common/empty/empty.component';
import { CurrentTimeService } from './common/services/time.service';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SigninRedirectCallbackComponent,
    SignoutRedirectCallbackComponent,
    NotificationComponent,
    RedirectComponent,
    EmptyComponent
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
    UserFriendsAccessService,
    CurrentTimeService,
    HubService,
    NotificationService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
