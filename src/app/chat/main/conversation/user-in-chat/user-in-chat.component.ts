import { Component, Input, OnInit } from '@angular/core';
import { UserModel } from 'src/app/common/models/user.model';
import { ImageAccessService } from 'src/app/user/services';

@Component({
  selector: 'user-in-chat',
  templateUrl: './user-in-chat.component.html'
})
export class UserInChatComponent implements OnInit {
  @Input() userToDisplay: UserModel;
  @Input() newUnseenMessages: number;
  public imageToShow: any = null;

  constructor(private _imageAccess: ImageAccessService) { }

  ngOnInit(): void {
    this.getImageFromService();
  }
  getImageFromService(): void {
    if (this.userToDisplay?.profileImagePath) {
      this._imageAccess.getImage(this.userToDisplay.id, this.userToDisplay.profileImagePath)
        .subscribe(data => {
          this.createImageFromBlob(data);;
        }, error => {
        });
    }
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
}
