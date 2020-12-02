import { Data } from '@angular/router';

export interface PostModel {
    id: string
    imageFullPath: string | null
    imagePath: string | null
    postComments: []
    postReactions: []
    text: string
    userId: string
    whenAdded: Data
}