import { Component, Input, OnInit } from '@angular/core';
import { UserModel } from 'src/app/common/models/user.model';

@Component({
  selector: 'user-card',
  templateUrl: './user-card.component.html'
})
export class UserCardComponent implements OnInit {

  @Input() userToDisplay : UserModel;
  constructor() { }

  ngOnInit(): void {
  }

}
