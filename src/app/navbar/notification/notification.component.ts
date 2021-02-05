import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { NotificationModel } from 'src/app/common/models/notification.model';
import { UserAccessService } from 'src/app/data/api-access';
import { UserModel } from 'src/app/common/models/user.model';
import { ImageAccessService } from 'src/app/user/services';

@Component({
  selector: 'navbar-notifications',
  templateUrl: './notification.component.html'
})
export class NotificationComponent implements OnInit {
  @Input() notification: NotificationModel;
  public fromWhoUser: UserModel = null;
  public message: string = null;
  public canNavigateToPost: boolean = false;
  public imageToShow: any = null;

  constructor(private _userAccess: UserAccessService,
    private _imageAccess: ImageAccessService) { }

  ngOnInit(): void {
    this._userAccess.getUser(this.notification.fromWho)
      .subscribe(user => {
        this.fromWhoUser = user;
        this.getImageFromService();
      })
    this.loadMessage();
  }
  loadMessage(): void {
    if (+this.notification.notificationType == 1) {
      this.message = "zaprasza Cię do znajomych"
    }
    else if (+this.notification.notificationType == 2) {
      this.canNavigateToPost = true;
      this.message = "zareagował na Twój post"
    }
    else if (+this.notification.notificationType == 3) {
      this.canNavigateToPost = true;
      this.message = "dodał komentarz do Twojego posta"
    }
    else if (+this.notification.notificationType == 4) {
      this.message = "zakceptował Twoje zaproszenie"
    }
  }

  getImageFromService(): void {
    if (this.fromWhoUser?.profileImagePath) {
      this._imageAccess.getImage(this.fromWhoUser.id, this.fromWhoUser.profileImagePath)
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