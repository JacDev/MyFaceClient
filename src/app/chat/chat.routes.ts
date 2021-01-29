import { ChatComponent } from './chat.component';


export const chatRoutes = [
  { path: '', component: ChatComponent},
  { path: '/:id', component: ChatComponent},
  { path: '**', component: ChatComponent}
]