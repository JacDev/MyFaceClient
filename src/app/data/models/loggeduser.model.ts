import { Data } from '@angular/router';

export class LoggedUser {
    id: string;
    firstName: string;
    lastName: string;
    profileImagePath: string;
    dateOfBirht: Data;
    
    constructor(user: LoggedUser) {
        this.id = user.id;
        this.firstName= user.firstName;
        this.lastName= user.lastName;
        this.profileImagePath= user.profileImagePath;
        this.dateOfBirht= user.dateOfBirht;
    }
}