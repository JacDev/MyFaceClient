import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { userRoutes } from './user.routes';
import { ProfileComponent } from './profile/profile.component';
import { HomeComponent } from './home/home.component';
import { UserComponent } from './shared/user/user.component';
import { PostComponent } from './shared/post/post.component';
import { FriendsComponent } from './friends/friends.component';
import { PostCommentsComponent } from './shared/post/post-comments/post-comments.component';
import { CommentComponent } from './shared/post/post-comments/comment/comment.component';



@NgModule({
  declarations: [
    ProfileComponent,
    PostComponent,
    HomeComponent,
    UserComponent,
    FriendsComponent,
    PostCommentsComponent,
    CommentComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(userRoutes),
  ]
})
export class UserModule { }