import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SigninRedirectCallbackComponent } from './core/authorization/signin-redirect-callback.component';
import { SignoutRedirectCallbackComponent } from './core/authorization/signout-redirect-callback.component';
import { AuthorizationRouteGuard } from './core/guards/authorize-route-guard';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: 'signin-callback', component: SigninRedirectCallbackComponent },
  { path: 'signout-callback', component: SignoutRedirectCallbackComponent },
  { path: '', component: HomeComponent, canActivate: [AuthorizationRouteGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
