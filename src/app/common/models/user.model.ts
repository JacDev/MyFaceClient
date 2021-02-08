import { Data } from '@angular/router';

export class UserModel {
    id: string;
    firstName: string;
    lastName: string;
    profileImagePath: string;
    dateOfBirht: Data;
    role: string;

    constructor(user: UserModel) {
        this.id = user.id;
        this.firstName= user.firstName;
        this.lastName= user.lastName;
        this.profileImagePath= user.profileImagePath;
        this.dateOfBirht= user.dateOfBirht;
        this.role = user.role;
    }
}
