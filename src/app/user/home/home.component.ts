import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthorizationService } from '../../core/authorization/authorization.service';
import { PostAccessService } from '../../data/api-access/post-access.service';
import { PaginatiomModel } from '../../data/common/pagination-model';
import { PostModel } from '../../data/models/post.model';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ImageAccessService } from 'src/app/data/api-access/image-access.service';

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
  public isLoadingNewPosts: Boolean = false;
  public currentLoggedUserId: string = null;
  public postForm: FormGroup;
  public postText: FormControl;
  public image: File = null;
  public isImageLoaded: boolean = false;
  public imageUrl: any;
  public screenHeight: number;
  public isAddingPost: boolean = false;
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
        },
        error => console.log('error', error)
      );
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
  }
  @HostListener("scroll", [])
  onScroll(event): void {
    //if (event.target.id == 'main-view') {
      if (this.bottomReached(event) && this.paginationParams.hasNext && !this.isLoadingNewPosts) {
        let newPosts: PostModel[] = null;
        this.isLoadingNewPosts = true;
        this._postAccess.getFriendsPosts(this._authService.currentUserId, this.paginationParams.nextPageLink)
          .subscribe(
            result => {
              newPosts = result.collection;
              this.paginationParams = result.paginationMetadata;

              this.listOfPostFromApi.push(...newPosts);
              console.log(this.listOfPostFromApi);
              console.log(this.paginationParams);
              this.isLoadingNewPosts = false;
            },
            error => console.log('error', error)
          );
      }
    //}
  }
  bottomReached(event): boolean {
    return (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight - 110);
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
      this.isAddingPost = true;
      let postToAdd: string = postForm.value.postText.trimEnd()
      let data = new FormData();
      data.append('text', postToAdd);
      data.append('picture', this.image);
      this._postAccess.postPost(this.currentLoggedUserId, data)
        .subscribe(result => {
          this.isAddingPost = false;
          this.listOfPostFromApi.unshift(result);
        })
      this.image = null;
      this.imageUrl = null;
      this.isImageLoaded = null;
    }
    postForm.reset();
  }
  isFileImage(file) {
    return file && file['type'].split('/')[0] === 'image';
  }
  addImage() {
    Swal.fire({
      title: '<h6>Wybierz zdjęcie:</h6>',
      text: 'Maksymalny rozmiar pliku to 25MB!',
      input: 'file',
      inputAttributes: {
        'accept': 'image/*',
        'aria-label': 'Wybierz zdjęcie:'
      },
      preConfirm: (result) => {
        console.log(result)
        if (result?.size > 25000000) {
          Swal.showValidationMessage(
            `Rozmiar przekracza 25MB!`
          )
        }
        else if (!this.isFileImage(result)) {
          Swal.showValidationMessage(
            `Podany plik nie jest zdjeciem!`
          )
        }
      }
    }).then((result) => {
      console.log(result)

      if (result.value) {
        this.image = result.value;
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
      width: this.screenWidth * 0.8,
      imageUrl: this.imageUrl,
      imageHeight: this.screenHeight * 0.8,
      imageWidth: 'auto',
      showCloseButton: true,
      showConfirmButton: false,
      imageAlt: 'Dodawane zdjęcie',
    })
  }

}
