import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { userRoutes } from './user.routes';
import { HomeComponent } from './home/home.component';
import { UserComponent } from './shared/user/user.component';
import { PostComponent } from './shared/post/post.component';
import { FriendsComponent } from './friends/friends.component';
import { PostCommentsComponent } from './shared/post/post-comments/post-comments.component';
import { CommentComponent } from './shared/post/post-comments/comment/comment.component';
import { UserCardComponent } from './shared/user/user-card/user-card.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextareaAutosizeModule } from 'ngx-textarea-autosize';
import { ProfileComponent } from './profile/profile.component';
import { SharedModule } from '../shared.module';
import { ImageAccessService, 
  PostAccessService, 
  ReactionAccessService } from './services/index';
import { PostCommentAccessService } from './shared/post/post-comments/post-comments-access.service';
import { UserDataComponent } from './profile/user-data/user-data.component';


@NgModule({
  declarations: [
    ProfileComponent,
    PostComponent,
    HomeComponent,
    UserComponent,
    FriendsComponent,
    PostCommentsComponent,
    CommentComponent,
    UserCardComponent,
    UserDataComponent,
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
    ImageAccessService
  ]
})
export class UserModule { }
