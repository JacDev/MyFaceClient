import { Component } from '@angular/core';

@Component({
  templateUrl: './chat.component.html'
})
export class ChatComponent {
  public userIdToOpen: string = null;

  constructor() {
  }

  ngOnInit(): void {
  }
}