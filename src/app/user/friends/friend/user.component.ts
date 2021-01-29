import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { UserModel } from 'src/app/common/models/user.model';

@Component({
  selector: 'friend',
  templateUrl: './user.component.html'
})
export class UserComponent implements OnInit {

  @Input() public userToDisplay: UserModel;
  @Output() deleteFriendEmitter: EventEmitter<string> = new EventEmitter<string>();

  constructor(private _router: Router) { }

  ngOnInit(): void {
  }
  redirectToChat(): void {
    this._router.navigate(['/', { outlets: { 'chat': ['', this.userToDisplay.id] } }], { skipLocationChange: true });
  }
  deleteFriend(): void {
    this.deleteFriendEmitter.emit(this.userToDisplay.id)
  }
}