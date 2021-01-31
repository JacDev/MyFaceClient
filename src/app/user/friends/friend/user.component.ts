import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserModel } from 'src/app/common/models/user.model';

@Component({
  selector: 'friend',
  templateUrl: './user.component.html'
})
export class UserComponent implements OnInit {

  @Input() public userToDisplay: UserModel;
  @Output() deleteFriendEmitter: EventEmitter<string> = new EventEmitter<string>();

  constructor(private _router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
  }
  deleteFriend(): void {
    this.deleteFriendEmitter.emit(this.userToDisplay.id)
  }
}