import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserAccessService } from 'src/app/data/api-access/api-access-index';
import { PostCommentModel } from 'src/app/data/models/post-comment.model';
import { UserModel } from 'src/app/data/models/user.model';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'post-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {

  @Input() comment: PostCommentModel;
  @Input() userToDisplay: UserModel;
  @Input() currentLoggedUserId: string;
  @Output() deleteCommentEvent: EventEmitter<string> = new EventEmitter<string>();
  @Output() editCommentEvent: EventEmitter<Object> = new EventEmitter<Object>();

  constructor(private _userAccess: UserAccessService) { }

  ngOnInit(): void {
    this._userAccess.getUser(this.comment.fromWho)
      .subscribe(
        resu => {
          this.userToDisplay = resu;
        },
        error => console.log('error', error)
      )
  }
  deleteComment() {
    Swal.fire({
      title: '<h6>Na pewno chcesz usunąć komentarz?</h6>',
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
        this.deleteCommentEvent.emit(this.comment.id);
      }
    })
  }
  editComment() {
    Swal.fire({
      input: 'textarea',
      inputAttributes: { color: 'white' },
      inputValue: this.comment.text,
      showCancelButton: true,
      confirmButtonColor: 'rgb(56, 224, 79)',

    }).then((result) => {
      if (result.isConfirmed && result.value.trim().length != 0) {
        this.editCommentEvent.emit({ id: this.comment.id, text: result.value });
      }
    })
  }
}