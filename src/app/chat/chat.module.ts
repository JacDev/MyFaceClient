import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextareaAutosizeModule } from 'ngx-textarea-autosize';
import { RouterModule } from '@angular/router';

import {
  UserInChatComponent,
  ConversationComponent,
  ChatMessageComponent,
  MainChatComponent
} from './main/index'
import {
  MessagesService,
  ChatService
} from './services/index'
import { ChatComponent } from './chat.component'
import { chatRoutes } from './chat.routes';
import { SharedModule } from '../shared.module';

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
    SharedModule
  ],
  providers: [
    MessagesService,
    ChatService
  ]
})
export class ChatModule { }
