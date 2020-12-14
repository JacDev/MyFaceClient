import { Component, Input, OnInit } from '@angular/core';
import { UserModel } from 'src/app/data/models/user.model';

@Component({
  selector: 'nav-found-user',
  templateUrl: './found-user.component.html',
  styleUrls: ['./found-user.component.css']
})
export class FoundUserComponent implements OnInit {
  
@Input() public foundUser : UserModel;
  constructor() { }

  ngOnInit(): void {
  }

}
