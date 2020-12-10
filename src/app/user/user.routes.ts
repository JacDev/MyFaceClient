import { AuthorizationRouteGuard } from '../core/guards/authorize-route-guard';
import { FriendsComponent } from './friends/friends.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { UserRouteActivator } from './shared/user/user-route-activator.service';


export const userRoutes = [
  { path: 'profile', component: ProfileComponent, canActivate: [AuthorizationRouteGuard] },
  { path: 'profile/:id', component: ProfileComponent, canActivate: [UserRouteActivator, AuthorizationRouteGuard] },
  { path: 'friends', component: FriendsComponent, canActivate: [AuthorizationRouteGuard] },
  { path: '', component: HomeComponent, canActivate: [AuthorizationRouteGuard] },
  
  // { path: 'login', component: LoginComponent },
  // { path: 'register', component: RegisterComponent }
]