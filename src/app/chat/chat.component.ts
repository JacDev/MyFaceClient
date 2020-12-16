import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from '../core/authorization/authorization-index';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html'
})
export class ChatComponent implements OnInit {

  constructor(private _authService:AuthorizationService) { }

  ngOnInit(): void {

  }

}
