import { AuthorizationRouteGuard } from '../core/guards/authorize-route-guard';
import { ChatMainComponent } from './chat-main/chat-main.component'


export const userRoutes = [
  { path: '', component: ChatMainComponent, canActivate: [AuthorizationRouteGuard] },
]