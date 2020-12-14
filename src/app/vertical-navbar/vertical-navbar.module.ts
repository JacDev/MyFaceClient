import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerticalNavbarComponent } from './vertical-navbar.component';
import { verticalNavbarRoutes } from './vertica-navbar.route';
import { RouterModule } from '@angular/router';
import { FoundUserComponent } from './found-user/found-user.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    VerticalNavbarComponent,
    FoundUserComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(verticalNavbarRoutes),
    FormsModule
  ]
})
export class VerticalNavbarModule { }
