import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  templateUrl: './chat.component.html'
})
export class ChatComponent {
  public userIdToOpen: string = null;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.userIdToOpen = params['id']
    })
  }
}