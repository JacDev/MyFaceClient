import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat.component';
import { RouterModule } from '@angular/router';
import { chatRoutes } from './chat.routes';

import { UserInChatComponent } from './main/conversation/user-in-chat/user-in-chat.component';
import { ConversationComponent } from './main/conversation/conversation.component';
import { ChatMessageComponent } from './main/conversation/chat-message/chat-message.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextareaAutosizeModule } from 'ngx-textarea-autosize';
import { MainChatComponent } from './main/main-chat.component';

@NgModule({
  declarations: [
    UserInChatComponent, 
    MainChatComponent, 
    ChatComponent, 
    ChatMessageComponent, 
    ConversationComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(chatRoutes),
    FormsModule,
    ReactiveFormsModule,
    TextareaAutosizeModule,
  ]
})
export class ChatModule { }
