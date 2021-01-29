import { AuthorizationRouteGuard } from '../core/guards/authorize-route-guard';
import { FriendsComponent } from './friends/friends.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { PostComponent } from './shared/post/post.component';
import { UserRouteActivator } from './services/user-route-activator.service';


export const userRoutes = [
  { path: 'profile', component: ProfileComponent, canActivate: [AuthorizationRouteGuard] },
  { path: 'profile/:id', component: ProfileComponent, canActivate: [UserRouteActivator, AuthorizationRouteGuard] },
  { path: 'friends', component: FriendsComponent, canActivate: [AuthorizationRouteGuard] },
  { path: ':userId/post/:id', component: PostComponent, canActivate: [AuthorizationRouteGuard] },
  { path: '', component: HomeComponent, canActivate: [AuthorizationRouteGuard] },
]