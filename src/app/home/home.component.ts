import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from '../core/authorization/authorization.service';
import { PostAccessService } from '../data/api-access/post-access.service';
import { PostModel } from '../data/models/post.model';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'
  ]
})

export class HomeComponent implements OnInit {

  constructor(private _dataService: PostAccessService, 
    private _authService: AuthorizationService) {

  }
  public listOfPostFromApi: PostModel[] = null;
  ngOnInit(): void {
    this._dataService.getUserPosts(this._authService.currentUserId)
      .subscribe(
        result => {
          this.listOfPostFromApi = result;
          console.log(this.listOfPostFromApi);
        },
        error => console.log('error', error)
      );
  }
}
