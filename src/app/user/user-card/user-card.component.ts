import { Component, Input, OnInit } from '@angular/core';
import { UserModel } from 'src/app/data/models/user.model';

@Component({
  selector: 'user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.css']
})
export class UserCardComponent implements OnInit {

  @Input() userToDisplay : UserModel;
  constructor() { }

  ngOnInit(): void {
  }

}
