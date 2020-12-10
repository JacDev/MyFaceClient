import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserInChatComponent } from './user-in-chat/user-in-chat.component';
import { MainComponent } from './main/main.component';
import { ChatComponent } from './chat.component';
import { RouterModule } from '@angular/router';
import { chatRoutes } from './chat.routes';

@NgModule({
  declarations: [
    UserInChatComponent, 
    MainComponent, 
    ChatComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(chatRoutes),
  ]
})
export class ChatModule { }
