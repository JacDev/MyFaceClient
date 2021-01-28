import { AuthorizationRouteGuard } from '../core/guards/authorize-route-guard';
import { ChatComponent } from './chat.component';


export const chatRoutes = [
  { path: '', component: ChatComponent},
  { path: '/:id', component: ChatComponent},
  { path: '/chat/:id', component: ChatComponent},
  { path: '/chat', component: ChatComponent},

  { path: '**', component: ChatComponent}
]