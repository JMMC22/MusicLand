import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Message } from 'src/app/models/message';
import { FollowService } from 'src/app/services/follow.service';
import { Follow } from 'src/app/models/follow';
import { MessageService } from 'src/app/services/message.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-create-message',
  templateUrl: './create-message.component.html',
  providers: [FollowService]
})
export class CreateMessageComponent implements OnInit {

  public identity;
  public token;
  public stats;
  public status;
  public count;
  public message: Message;
  public follows: Follow[];
  public users: User[];

  constructor(private _userService: UserService, private _followService: FollowService, private _messageService: MessageService) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.stats = this._userService.getStats();
    this.message = new Message("", "", "", "", this.identity._id, "");
  }

  ngOnInit() {
    this.getMyFolloweds();
  }

  onSubmit(form) {
    this._messageService.create(this.token, this.message).subscribe(
      response => {
        if (response.message) {
          this.status = "success";
          form.reset();
        }
      }, error => {
        this.status = "error";
        console.log(error);
      })
  }
  getMyFolloweds() {
    if (this.identity.role == 'ROLE_ADMIN') {
      this._userService.getAllUsers().subscribe(
        response => {
          this.users = response.users;
        }
        , error => {
          console.log(error);
        })
    } else {
      this._followService.getMyFolloweds(this.token).subscribe(response => {
        this.follows = response.follows;
        this.getMessagesUnViewed();
      }, error => {
        console.log(error);
      })
    }
  }

  getMessagesUnViewed() {
    this._messageService.getMessagesUnviewed(this.token).subscribe(response => {

      this.count = response.unviewed;
      localStorage.setItem('messages', JSON.stringify(response.unviewed));

    }, err => {
      console.log(err);
    })
  }

}
