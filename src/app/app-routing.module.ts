import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SigninRedirectCallbackComponent } from './core/authorization/signin-redirect-callback.component';
import { SignoutRedirectCallbackComponent } from './core/authorization/signout-redirect-callback.component';
import { AuthorizationRouteGuard } from './core/guards/authorize-route-guard';
import { HomeComponent } from './user/home/home.component';
import { UserModule } from './user/user.module'

const routes: Routes = [
  { path: 'signin-callback', component: SigninRedirectCallbackComponent },
  { path: 'signout-callback', component: SignoutRedirectCallbackComponent },
  { path: 'user', loadChildren: './user/user.module#UserModule', canActivate:[AuthorizationRouteGuard] },
  { path: '', component: HomeComponent, canActivate: [AuthorizationRouteGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
