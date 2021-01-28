import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SigninRedirectCallbackComponent } from './core/authorization/signin-redirect-callback.component';
import { SignoutRedirectCallbackComponent } from './core/authorization/signout-redirect-callback.component';
import { AuthorizationRouteGuard } from './core/guards/authorize-route-guard';
import { HomeComponent } from './user/home/home.component';
import { UserModule } from './user/user.module'
import { ChatModule } from './chat/chat.module'
import { ChatComponent } from './chat/chat.component';
import { VerticalNavbarModule } from './vertical-navbar/vertical-navbar.module';
import { RedirectComponent } from './common/redirect/redirect.component';

const routes: Routes = [
  { path: 'signin-callback', component: SigninRedirectCallbackComponent },
  { path: 'signout-callback', component: SignoutRedirectCallbackComponent },
  { path: 'redirect', component: RedirectComponent },
  { path: '', loadChildren: './user/user.module#UserModule', canActivate: [AuthorizationRouteGuard] },
  { path: '', loadChildren: './chat/chat.module#ChatModule', outlet: 'chat' },
  { path: '', loadChildren: './vertical-navbar/vertical-navbar.module#VerticalNavbarModule', outlet: 'left-routing' },
  { path: '**', redirectTo: '', canActivate: [AuthorizationRouteGuard] },
  //{ path: '', component: ChatComponent, outlet: 'aside', canActivate: [AuthorizationRouteGuard] },
  //{ path: '', component: HomeComponent, canActivate: [AuthorizationRouteGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
