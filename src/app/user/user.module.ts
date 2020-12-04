import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { userRoutes } from './user.routes';
import { ProfileComponent } from './profile/profile.component';
import { HomeComponent } from './home/home.component';
import { UserComponent } from './shared/user/user.component';
import { PostComponent } from './shared/post/post.component';
import { FriendsComponent } from './friends/friends.component';



@NgModule({
  declarations: [
    ProfileComponent,
    PostComponent,
    HomeComponent,
    UserComponent,
    FriendsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(userRoutes),
  ]
})
export class UserModule { }
