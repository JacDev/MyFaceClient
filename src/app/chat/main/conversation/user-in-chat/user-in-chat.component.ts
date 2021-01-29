import { Component, Input, OnInit } from '@angular/core';
import { UserModel } from 'src/app/common/models/user.model';

@Component({
  selector: 'user-in-chat',
  templateUrl: './user-in-chat.component.html'
})
export class UserInChatComponent implements OnInit {
  @Input() userToDisplay: UserModel;
  @Input() newUnseenMessages: number;
  constructor() { }

  ngOnInit(): void {
  }

}
