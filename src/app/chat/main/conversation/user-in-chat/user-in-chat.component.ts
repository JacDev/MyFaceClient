import { Component, Input, OnInit } from '@angular/core';
import { UserModel } from 'src/app/data/models/user.model';

@Component({
  selector: 'app-user-in-chat',
  templateUrl: './user-in-chat.component.html',
  styleUrls: ['./user-in-chat.component.css']
})
export class UserInChatComponent implements OnInit {
  @Input() userToDisplay: UserModel;
  @Input() newUnseenMessages:number;
  constructor() { }

  ngOnInit(): void {
  }

}
