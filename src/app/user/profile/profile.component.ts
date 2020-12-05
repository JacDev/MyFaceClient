import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthorizationService } from 'src/app/core/authorization/authorization-index';
import { PostAccessService, UserAccessService } from 'src/app/data/api-access/api-access-index';
import { PaginatiomModel } from 'src/app/data/common/pagination-model';
import { PostModel } from 'src/app/data/models/post.model';
import { UserModel } from 'src/app/data/models/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {
  
    constructor(private _postDataService: PostAccessService, 
      private _userDataService: UserAccessService,
      private _authService: AuthorizationService,
      private route: ActivatedRoute,) { 
    }
    
    public listOfPostFromApi: PostModel[] = null;
    public paginationParams: PaginatiomModel = null;
    public currentUser: UserModel = null;
    ngOnInit(): void {
      const currentUserId = this.route.snapshot.params['id'] ||  this._authService.currentUserId;
     if(this.route.snapshot.params['id']){
       this._userDataService.getUser(currentUserId)
       .subscribe(
         result=>{
          this.currentUser = result;
          this.getPosts();
         }
       ),
       error => console.log('error', error)
     }
     else{
      this.currentUser = this._authService.currentUser;
      this.getPosts()
     }
      
    }
    getPosts(){
      return this._postDataService.getUserPosts(this.currentUser.id)
        .subscribe(
          result => {
            this.listOfPostFromApi = result.collection;
            this.paginationParams = result.paginationMetadata;
            console.log(this.listOfPostFromApi);
            console.log(this.paginationParams);
          },
          error => console.log('error', error)
        );
    }
    @HostListener("window:scroll", [])
    onScroll(): void {
      if (this.bottomReached() && this.paginationParams.hasNext) {
        let newPosts : PostModel[]  = null;
        this._postDataService.getUserPosts(this._authService.currentUserId, this.paginationParams.nextPageLink)
        .subscribe(
          result => {
            newPosts  = result.collection;
            this.paginationParams = result.paginationMetadata;
  
            this.listOfPostFromApi.push(... newPosts);
            console.log(this.listOfPostFromApi);
            console.log(this.paginationParams);
          },
          error => console.log('error', error)
        );
  
      }
    }
  
    bottomReached(): boolean {
      // console.log('window.innerHeight + window.scrollY= ', window.innerHeight + window.scrollY, 'document.body.offsetHeight= ', document.body.offsetHeight-1)
      // console.log((window.innerHeight + window.scrollY) >= (document.body.offsetHeight-1));
      return (window.innerHeight + window.scrollY) >= (document.body.offsetHeight-1);
    }
  }
  