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
  constructor(private _userAccess: UserAccessService) { }

  ngOnInit(): void {
    this._userAccess.getUser(this.notification.fromWho)
      .subscribe(user => {
        this.fromWhoUser = user;
      })
      this.loadMessage();
  }
loadMessage(){
  if(+this.notification.notificationType==2){
    this.message="zaprasza Cię do znajomych"
  }
  if(+this.notification.notificationType==3){
    this.message="zareagował na Twój post"
  }
  if(+this.notification.notificationType==4){
    this.message="dodał komentarz do Twojego posta"
  }
}
}
