import { Component, Input, OnInit } from '@angular/core';
import { UserModel } from 'src/app/common/models/user.model';
import { ImageAccessService } from 'src/app/user/services';

@Component({
  selector: 'nav-found-user',
  templateUrl: './found-user.component.html'
})
export class FoundUserComponent implements OnInit {

  @Input() public foundUser: UserModel;
  constructor(private _imageAccess: ImageAccessService) { }
  public imageToShow: any = null;

  ngOnInit(): void {
    this.getImageFromService();
  }
  getImageFromService(): void {
    if (this.foundUser?.profileImagePath) {
      this._imageAccess.getImage(this.foundUser.id, this.foundUser.profileImagePath)
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
