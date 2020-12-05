import { Component, Input, OnInit } from '@angular/core';
import { PostCommentModel } from 'src/app/data/models/post-comment.model';

@Component({
  selector: 'post-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {

@Input() comment:PostCommentModel;
  constructor() { }

  ngOnInit(): void {
  }

}
