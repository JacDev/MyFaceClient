import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  SigninRedirectCallbackComponent,
  SignoutRedirectCallbackComponent
} from './core/authorization//index';
import { AuthorizationRouteGuard } from './core/guards/authorize-route-guard';
import { HomeComponent } from './user/home/home.component';
import { UserModule } from './user/user.module'
import { ChatModule } from './chat/chat.module'
import { ChatComponent } from './chat/chat.component';
import { VerticalNavbarModule } from './vertical-navbar/vertical-navbar.module';
import { RedirectComponent } from './common/redirect/redirect.component';
import { EmptyComponent } from './common/empty/empty.component';


const routes: Routes = [
  { path: 'signin-callback', component: SigninRedirectCallbackComponent },
  { path: 'signout-callback', component: SignoutRedirectCallbackComponent },
  { path: 'redirect', component: RedirectComponent },
  {
    path: 'chat', canActivate: [AuthorizationRouteGuard],
    children: [
      { path: '', loadChildren: './chat/chat.module#ChatModule' },
      { path: '', component: EmptyComponent, outlet: 'chat' },
      { path: '', component: EmptyComponent, outlet: 'left-routing' }
    ]
  },
  {
    path: 'find', canActivate: [AuthorizationRouteGuard],
    children: [
      { path: '', loadChildren: './vertical-navbar/vertical-navbar.module#VerticalNavbarModule' },
      { path: '', component: EmptyComponent, outlet: 'chat' },
      { path: '', component: EmptyComponent, outlet: 'left-routing' }
    ]
  },
  {
    path: '', canActivate: [AuthorizationRouteGuard], children: [
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
