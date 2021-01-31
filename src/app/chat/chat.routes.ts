import { ChatComponent } from './chat.component';


export const chatRoutes = [
  { path: '', component: ChatComponent },
  { path: '**', component: ChatComponent }
]