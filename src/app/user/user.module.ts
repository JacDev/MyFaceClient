import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { userRoutes } from './user.routes';
import { ProfileComponent } from './profile/profile.component';
import { PostComponent } from '../post/post.component';
import { HomeComponent } from './home/home.component';



@NgModule({
  declarations: [
    ProfileComponent,
    PostComponent,
    HomeComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(userRoutes),
  ]
})
export class UserModule { }
