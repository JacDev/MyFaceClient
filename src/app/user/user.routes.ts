import { AuthorizationRouteGuard } from '../core/guards/authorize-route-guard';
import { ProfileComponent } from './profile/profile.component';

  
  export const userRoutes = [
    { path: 'profile', component: ProfileComponent, canActivate: [AuthorizationRouteGuard]  },
    // { path: 'login', component: LoginComponent },
    // { path: 'register', component: RegisterComponent }
  ]