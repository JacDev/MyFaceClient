import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { ImageAccessService } from 'src/app/user/services/image-access.service';
import { PostModel } from 'src/app/data/models/post.model';
import { UserModel } from 'src/app/data/models/user.model';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import {
  PostAccessService,
  ReactionAccessService
} from '../../services/index';
import { UserAccessService } from 'src/app/data/api-access';
import { NotificationService } from 'src/app/data/notification.service';
import { CurrentTimeService } from 'src/app/common/time.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthorizationService } from 'src/app/core/authorization/authorization-index';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  @Input() postToDisplay: PostModel;
  @Input() currentLoggedUserId: string;
  @Output() deletePostFromListEvent: EventEmitter<string> = new EventEmitter<string>();

  public userToDisplay: UserModel;
  public showComments: boolean = false;
  public isAlreadyLike: boolean = false;
  public reactionCounter: number = 0;
  public commentsCounter: number = 0;
  public isLoading: boolean = false;
  public imageToShow: any;
  public isImageLoading: boolean = false;

  public screenHeight: number;
  screenWidth: number;
  private hasParent: boolean;

  constructor(private _userAccess: UserAccessService,
    private _postReactionsAccess: ReactionAccessService,
    private _postAccess: PostAccessService,
    private _imageAccess: ImageAccessService,
    private _notificationService: NotificationService,
    private _timeService: CurrentTimeService,
    private _route: ActivatedRoute,
    private _authService: AuthorizationService,
    router: Router) {
    if (router.url.indexOf('post') > 0) {
      this.hasParent = false;
    } else {
      this.hasParent = true;
    }
  }

  ngOnInit(): void {
    if (!this.hasParent) {
      let postId: string;
      let userId: string;
      this._route.params.forEach((params: Params) => {
        postId = params['id'];
        userId = params['userId'];
        this._postAccess.getPost(userId, postId)
        .subscribe(post => {
          this.postToDisplay = post;
          this.currentLoggedUserId = this._authService.currentUserId;
          this.loadPost();
        })
      }
      );
    }
    else {
      this.loadPost();
    }
    this.getScreenSize();

  }
  loadPost() {
    this.getImageFromService();
    this.reactionCounter = this.postToDisplay.postReactionsCounter;
    this.commentsCounter = this.postToDisplay.postCommentsCounter;
    this._userAccess.getUser(this.postToDisplay.userId)
      .subscribe(
        result => {
          this.userToDisplay = result;
        },
        error => console.log('error', error)
      );
    this._postReactionsAccess.getPostReactions(this.postToDisplay.userId, this.postToDisplay.id)
      .subscribe(
        result => {
          result.some(x => {
            if (x.fromWho == this.currentLoggedUserId) {
              this.isAlreadyLike = true;
            }
          })
        },
        error => console.log('error', error)
      )
  }
  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
  }
  createImageFromBlob(image: Blob): void {
    let reader: FileReader = new FileReader();
    reader.addEventListener("load", () => {
      this.imageToShow = reader.result;
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }
  getImageFromService() {
    if (this.postToDisplay.imagePath) {
      this.isImageLoading = true;
      this._imageAccess.getImage(this.currentLoggedUserId, this.postToDisplay.imagePath).subscribe(data => {
        this.createImageFromBlob(data);
        this.isImageLoading = false;
      }, error => {
        this.isImageLoading = false;
        console.log(error);
      });
    }
  }

  ShowComments() {
    this.showComments = !this.showComments;
  }
  changeReacton() {
    if (this.isAlreadyLike) {
      this.reactionCounter--;
      this._postReactionsAccess.deletePostReactions(this.postToDisplay.userId, this.postToDisplay.id, this.currentLoggedUserId)
        .subscribe();
    }
    else {
      this.reactionCounter++;
      this._postReactionsAccess.postPostReactions(this.postToDisplay.userId, this.postToDisplay.id, this.currentLoggedUserId)
        .subscribe(() => {
          this._notificationService.sendNotification(this.userToDisplay.id, "reaction", this._timeService.getCurrentDate(), this.postToDisplay.id)
        });
    }
    this.isAlreadyLike = !this.isAlreadyLike;
  }
  hideComments(hide: boolean) {
    this.showComments = false;
  }
  changeCommentsCounter(event: number) {
    this.commentsCounter += event;
  }
  editPost() {
    Swal.fire({
      input: 'textarea',
      inputAttributes: { color: 'white' },
      inputValue: this.postToDisplay.text,
      showCancelButton: true,
      confirmButtonColor: 'rgb(56, 224, 79)',

    }).then((result) => {
      console.log(result);
      if (result.isConfirmed && result.value.trim().length != 0) {
        this.isLoading = true;
        this._postAccess.patchPost(this.currentLoggedUserId, this.postToDisplay.id, result.value)
          .subscribe(_ => {
            this.isLoading = false;
            this.postToDisplay.text = result.value;
          });
      }
    })
  }
  deletePost() {
    Swal.fire({
      title: '<h6>Na pewno chcesz usunąć post?</h6>',
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText:
        '<i class="fa fa-thumbs-up"></i>',
      confirmButtonAriaLabel: 'Thumbs up, great!',
      confirmButtonColor: 'rgb(56, 224, 79)',
      cancelButtonText:
        '<i class="fa fa-thumbs-down"></i>',
      cancelButtonAriaLabel: 'Thumbs down'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this._postAccess.deletePost(this.currentLoggedUserId, this.postToDisplay.id)
          .subscribe(result => {
            this.isLoading = false;
            this.deletePostFromListEvent.emit(this.postToDisplay.id);
          },
            error => console.log('error', error));
      }
    })
  }
  showImage() {
    Swal.fire({
      width: this.screenWidth * 0.8,
      imageUrl: this.imageToShow,
      imageHeight: this.screenHeight * 0.8,
      imageWidth: 'auto',
      showCloseButton: true,
      showConfirmButton: false,
      imageAlt: 'Dodawane zdjęcie',
    })
  }
}
