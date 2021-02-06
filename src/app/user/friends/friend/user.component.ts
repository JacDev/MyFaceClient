import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserModel } from 'src/app/common/models/user.model';

@Component({
  selector: 'friend',
  templateUrl: './user.component.html'
})
export class UserComponent implements OnInit {

  @Input() public userToDisplay: UserModel;
  @Input() public canDelete: boolean = false;
  @Output() deleteFriendEmitter: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }
  deleteFriend(): void {
    this.deleteFriendEmitter.emit(this.userToDisplay.id)
  }
}
