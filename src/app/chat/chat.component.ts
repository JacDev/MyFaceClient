import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from '../core/authorization/authorization-index';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  constructor(private _authService:AuthorizationService) { }

  ngOnInit(): void {

  }

}
