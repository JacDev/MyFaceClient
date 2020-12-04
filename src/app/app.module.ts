import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DataAccessService } from './data/api-service/data.service';

import { AuthInterceptorService } from './data/api-service/auth-interceptor.service';
import { NavbarComponent } from './navbar/navbar.component';
import { AuthorizationRouteGuard } from './core/guards/authorize-route-guard';


import {SignoutRedirectCallbackComponent, SigninRedirectCallbackComponent, AuthorizationService} from './core/authorization/authorization-index'
import { UserAccessService, PostAccessService } from './data/api-access/api-access-index';
import { UserFriendsAccessService } from './data/api-access/user-friends-access.service';
import { VerticalNavbarComponent } from './vertical-navbar/vertical-navbar.component';
import { UserRouteActivator } from './user/shared/user/user-route-activator.service';


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
    ReactiveFormsModule,
    RouterModule,
  ],
  providers: [
    AuthorizationService,
    DataAccessService,
    UserAccessService,
    PostAccessService,
    AuthInterceptorService,
    DataAccessService,
    AuthorizationRouteGuard,
    UserFriendsAccessService,
    UserRouteActivator,
    {provide : HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
