import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthorizationService } from '../../core/authorization/authorization.service';
import { PostAccessService } from '../services/post-access.service';
import { PaginatiomModel } from '../../common/models/pagination-model';
import { PostModel } from '../models/post.model';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  templateUrl: './home.component.html'
})

export class HomeComponent implements OnInit {

  constructor(private _postAccess: PostAccessService,
    private _authService: AuthorizationService) {
  }
  public listOfPostFromApi: PostModel[] = null;
  public paginationParams: PaginatiomModel = null;

  public currentLoggedUserId: string = null;
  public postForm: FormGroup;
  public postText: FormControl;

  public imageUrl: string | ArrayBuffer;
  public image: File = null;
  public screenHeight: number;
  public screenWidth: number;

  public isAddingPost: boolean = false;
  public isImageLoaded: boolean = false;
  public isLoadingNewPosts: boolean = false;

  public showError: boolean = false;
  private imageWidth: number;
  private imageFrameWidth: number;

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
        error => this.showError = true
      );
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(): void {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    if(this.screenWidth < 650){
      this.imageFrameWidth = this.screenWidth;
      this.imageWidth= this.screenWidth;
    }
    else{
      this.imageFrameWidth = this.screenWidth * 0.8;
      this.imageWidth= this.screenWidth * 0.4;
    }
  }
  @HostListener("scroll", ['$event'])
  onScroll(event: Event): void {
    if (this.bottomReached(event) && this.paginationParams.hasNext && !this.isLoadingNewPosts) {
      this.isLoadingNewPosts = true;
      this._postAccess.getFriendsNextPosts(this.paginationParams.nextPageLink)
        .subscribe(
          result => {
            this.paginationParams = result.paginationMetadata;
            this.listOfPostFromApi.push(...result.collection);
            this.isLoadingNewPosts = false;
          },
          error => this.showError = true
        );
    }
  }
  bottomReached(event: any): boolean {
    return (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight - 110);
  }
  deletePost(postId: string): void {
    this.listOfPostFromApi = this.listOfPostFromApi.filter(x => x.id !== postId);
  }
  addPost(postForm: FormGroup): void {
    if ((postForm.value.postText && postForm.value.postText.trim().length != 0) || this.image) {
      this.isAddingPost = true;
      let text: string = postForm.value.postText?.trimEnd() || "";
      this._postAccess.postPost(this.currentLoggedUserId, text, this.image)
        .subscribe(result => {
          this.isAddingPost = false;
          this.listOfPostFromApi.unshift(result);
        },
          error => this.showError = true
        )

      this.image = null;
      this.imageUrl = null;
      this.isImageLoaded = null;
    }
    postForm.reset();
  }

  isFileImage(file: File): boolean {
    return file && file.type.split('/')[0] === 'image';
  }
  addImage(): void {
    Swal.fire({
      title: '<h6>Wybierz zdjęcie:</h6>',
      text: 'Maksymalny rozmiar pliku to 25MB!',
      input: 'file',
      inputAttributes: {
        'accept': 'image/*',
        'aria-label': 'Wybierz zdjęcie:'
      },
      preConfirm: (result) => {
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
  showImage(): void {
    Swal.fire({
      width: this.imageFrameWidth,
      imageUrl: this.imageUrl,
      imageHeight: 'auto',
      imageWidth: this.imageWidth,
      showCloseButton: true,
      showConfirmButton: false,
      imageAlt: 'Dodawane zdjęcie',
    })
  }
}
