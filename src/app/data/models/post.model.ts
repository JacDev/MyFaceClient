import { Data } from '@angular/router';

export interface PostModel {
    id: string
    imageFullPath: string | null
    imagePath: string | null
    postCommentsCounter: number
    postReactionsCounter: number
    text: string
    userId: string
    whenAdded: Data
    firstName:string;
    lastName:string;
}