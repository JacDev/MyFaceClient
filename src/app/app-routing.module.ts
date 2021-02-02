import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  SigninRedirectCallbackComponent,
  SignoutRedirectCallbackComponent,
  AuthorizationRouteGuard
} from './core/authorization//index';

import { UserModule } from './user/user.module'
import { ChatModule } from './chat/chat.module'
import { VerticalNavbarModule } from './vertical-navbar/vertical-navbar.module';

import { RedirectComponent } from './common/redirect/redirect.component';
import { EmptyComponent } from './common/empty/empty.component';


const routes: Routes = [
  { path: 'signin-callback', component: SigninRedirectCallbackComponent },
  { path: 'signout-callback', component: SignoutRedirectCallbackComponent },
  { path: 'redirect', component: RedirectComponent },

{
  path: 'find', canActivate: [AuthorizationRouteGuard],
  children: [
    { path: '', loadChildren: './vertical-navbar/vertical-navbar.module#VerticalNavbarModule' },
    { path: '', component: EmptyComponent, outlet: 'chat' },
    { path: '', component: EmptyComponent, outlet: 'left-routing' }
  ]
},
  {
    path: 'chat', canActivate: [AuthorizationRouteGuard],
    children: [
      { path: '', loadChildren: './chat/chat.module#ChatModule' },
      { path: 'chat', pathMatch: 'full', component: EmptyComponent, outlet: 'chat' },
      { path: 'chat', component: EmptyComponent, outlet: 'left-routing' }
    ]
  },

  {
    path: '', canActivate: [AuthorizationRouteGuard],
    children: [
      { path: '', loadChildren: './user/user.module#UserModule' },
      { path: '', loadChildren: './chat/chat.module#ChatModule', outlet: 'chat' },
      { path: '', loadChildren: './vertical-navbar/vertical-navbar.module#VerticalNavbarModule', outlet: 'left-routing' }]
  },
  { path: '**', redirectTo: '', canActivate: [AuthorizationRouteGuard] },
];









@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
