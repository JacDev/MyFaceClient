import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthorizationService } from '../../core/authorization/authorization.service';
import { PostAccessService } from '../../data/api-access/post-access.service';
import { PaginatiomModel } from '../../data/common/pagination-model';
import { PostModel } from '../../data/models/post.model';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'
  ]
})

export class HomeComponent implements OnInit {

  constructor(private _postAccess: PostAccessService,
    private _authService: AuthorizationService) {
  }
  public listOfPostFromApi: PostModel[] = null;
  public paginationParams: PaginatiomModel = null;
  private _isLoadingNewPosts: Boolean = false;
  public currentLoggedUserId: string = null;
  public postForm: FormGroup;
  public postText: FormControl;
  public image: File;
  public isImageLoaded: boolean = false;
  public imageUrl: any;
  public screenHeight: number;
  screenWidth: number;

  ngOnInit(): void {
    this.getScreenSize();
    this.postText = new FormControl();
    this.postForm = new FormGroup({
      postText: this.postText
    })
    this.currentLoggedUserId = this._authService.currentUserId;
    this._postAccess.getFriendsPosts(this._authService.currentUserId)
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

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
  }
  @HostListener("window:scroll", [])
  onScroll(): void {
    if (this.bottomReached() && this.paginationParams.hasNext && !this._isLoadingNewPosts) {
      let newPosts: PostModel[] = null;
      this._isLoadingNewPosts = true;
      this._postAccess.getFriendsPosts(this._authService.currentUserId, this.paginationParams.nextPageLink)
        .subscribe(
          result => {
            newPosts = result.collection;
            this.paginationParams = result.paginationMetadata;

            this.listOfPostFromApi.push(...newPosts);
            console.log(this.listOfPostFromApi);
            console.log(this.paginationParams);
            this._isLoadingNewPosts = false;
          },
          error => console.log('error', error)
        );

    }
  }

  bottomReached(): boolean {
    return (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 1);
  }
  deletePost(postId: string) {
    this.listOfPostFromApi = this.listOfPostFromApi.filter(x => x.id !== postId);
  }
  addPost(postForm: FormGroup) {
    console.log(postForm.value.postText)
    if (!postForm.value.postText || postForm.value.postText.trim().length == 0) {
      console.log("pusty")
    }
    else {
      let postToAdd:string = postForm.value.postText.trimEnd()

      this._postAccess.postPost(this.currentLoggedUserId, { 'text': postToAdd })
        .subscribe(result => {
          this.listOfPostFromApi.unshift(result);
        })
    }
    postForm.reset();
  }
  addImage() {
    Swal.fire({
      title: 'Wybierz zdjęcie:',
      input: 'file',
      inputAttributes: {
        'accept': 'image/*',
        'aria-label': 'Wybierz zdjęcie:'
      }
    }).then((result) => {
      console.log(result.value);
      if (result.value) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.imageUrl = e.target.result;
          this.isImageLoaded = true;
        }
        reader.readAsDataURL(result.value)
      }
    })
  }
  showImage() {
    Swal.fire({
      width:this.screenWidth*0.8,
      imageUrl: this.imageUrl,
      imageHeight: this.screenHeight*0.8,
      imageWidth:'auto',
      showCloseButton: true,
      showConfirmButton:false,
      imageAlt: 'Dodawane zdjęcie',
      focusClose: false,
    })
  }

}
