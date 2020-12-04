import { Component, Input, OnInit } from '@angular/core';
import { UserModel } from 'src/app/data/models/user.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  @Input() public userToDisplay:UserModel;
  
  constructor() { }

  ngOnInit(): void {
  }

}
