import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserAccessService } from 'src/app/data/api-access/index';
import { PostCommentModel } from 'src/app/user/models/post-comment.model';
import { UserModel } from 'src/app/common/models/user.model';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { PostCommentToUpdate } from '../post-comment-to-update.model';
import { AuthorizationService } from 'src/app/core/authorization';

@Component({
  selector: 'post-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['../.././post.component.css']
})
export class CommentComponent implements OnInit {

  @Input() comment: PostCommentModel;
  @Input() userToDisplay: UserModel;
  @Input() currentLoggedUserId: string;
  @Output() deleteCommentEvent: EventEmitter<string> = new EventEmitter<string>();
  @Output() editCommentEvent: EventEmitter<PostCommentToUpdate> = new EventEmitter<PostCommentToUpdate>();

  constructor(private _userAccess: UserAccessService,
    private _authService: AuthorizationService) { }

  ngOnInit(): void {
    this._userAccess.getUser(this.comment.fromWho)
      .subscribe(
        resu => {
          this.userToDisplay = resu;
        }
      )
  }
  deleteComment() {
    Swal.fire({
      title: '<h5>Na pewno chcesz usunąć komentarz?</h5>',
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText:
        '<i class="fa fa-thumbs-up"></i>',
      confirmButtonAriaLabel: 'Thumbs up, great!',
      confirmButtonColor: 'rgb(253, 126, 20)',
      cancelButtonText:
        '<i class="fa fa-thumbs-down"></i>',
      cancelButtonAriaLabel: 'Thumbs down'
    }).then((result) => {
      if (result.isConfirmed) {
        if(!this._authService.canDelete){
          Swal.fire({
            icon: 'error',
            text: 'Nie możesz usunąć komentarza w trybie demo!',
            confirmButtonColor: 'rgb(253, 126, 20)',
          })
        }
        else{
        this.deleteCommentEvent.emit(this.comment.id);
        }
      }
    })
  }
  editComment() {
    Swal.fire({
      input: 'textarea',
      inputAttributes: { color: 'white' },
      inputValue: this.comment.text,
      showCancelButton: true,
      confirmButtonColor: 'rgb(253, 126, 20)',

    }).then((result) => {
      if (result.isConfirmed && result.value.trim().length != 0) {
        this.editCommentEvent.emit({ id: this.comment.id, text: result.value });
      }
    })
  }
}
