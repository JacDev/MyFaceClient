import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { UserModel } from 'src/app/common/models/user.model';
import { ImageAccessService } from '../../services';

@Component({
  selector: 'user-card',
  templateUrl: './user-card.component.html'
})
export class UserCardComponent implements OnInit {

  @Input() userToDisplay: UserModel;
  public imageToShow: any = null;

  constructor(private _imageAccess: ImageAccessService) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
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
