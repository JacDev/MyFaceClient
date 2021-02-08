import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { userRoutes } from './user.routes';
import { HomeComponent } from './home/home.component';
import { UserComponent } from './friends/friend/user.component';
import { PostComponent } from './shared/post/post.component';
import { FriendsComponent } from './friends/friends.component';
import { PostCommentsComponent } from './shared/post/post-comments/post-comments.component';
import { CommentComponent } from './shared/post/post-comments/comment/comment.component';


import { TextareaAutosizeModule } from 'ngx-textarea-autosize';
import { ProfileComponent } from './profile/profile.component';
import { SharedModule } from '../shared.module';
import { ImageAccessService,
  PostAccessService,
  ReactionAccessService,
  UserRouteActivator} from './services/index';
import { PostCommentAccessService } from './shared/post/post-comments/post-comments-access.service';
import { UserDataComponent } from './profile/user-data/user-data.component';
import { UserCardComponent } from './shared/user-card/user-card.component';


@NgModule({
  declarations: [
    ProfileComponent,
    PostComponent,
    HomeComponent,
    UserComponent,
    FriendsComponent,
    PostCommentsComponent,
    CommentComponent,
    UserDataComponent,
    UserCardComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(userRoutes),
    FormsModule,
    ReactiveFormsModule,
    TextareaAutosizeModule,
    SharedModule
  ],
  providers:[
    PostAccessService,
    PostCommentAccessService,
    ReactionAccessService,
    UserRouteActivator
  ]
})
export class UserModule { }
