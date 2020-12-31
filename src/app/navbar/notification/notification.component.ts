import { Component, Input, OnInit } from '@angular/core';
import { NotificationDto } from 'src/app/common/models/notificationDto.model';
import { UserAccessService } from 'src/app/data/api-access';
import { UserModel } from 'src/app/data/models/user.model';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  @Input() notification: NotificationDto;
  public fromWhoUser: UserModel = null;
  public message: string = null;
  public canNavigateToPost:boolean = false;
  constructor(private _userAccess: UserAccessService) { }

  ngOnInit(): void {
    this._userAccess.getUser(this.notification.fromWho)
      .subscribe(user => {
        this.fromWhoUser = user;
      })
    this.loadMessage();
  }
  loadMessage() {
    if (+this.notification.notificationType == 1) {
      this.message = "zaprasza Cię do znajomych"
    }
    else if (+this.notification.notificationType == 2) {
      this.canNavigateToPost=true;
      this.message = "zareagował na Twój post"
    }
    else if (+this.notification.notificationType == 3) {
      this.canNavigateToPost=true;
      this.message = "dodał komentarz do Twojego posta"
    }
   else if (+this.notification.notificationType == 4) {
      this.message = "zakceptował Twoje zaproszenie"
    }
  }
}