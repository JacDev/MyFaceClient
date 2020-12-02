import { Component, Input, OnInit } from '@angular/core';
import { PostModel } from '../data/models/post.model';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  @Input() postToDisplay: PostModel;

    constructor(){}

  ngOnInit(): void {
  }
}
