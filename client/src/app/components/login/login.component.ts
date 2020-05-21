import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  providers: [UserService]
})
export class LoginComponent implements OnInit {

  public user: User;
  public status: string;
  public identity;
  public token: string;
  public count;

  constructor(private _route: ActivatedRoute, private _router: Router,
    private _userService: UserService, private _messageService: MessageService) {

    this.user = new User("", "", "", "", "ROLE_USER", "");

  }

  ngOnInit() {
  }

  onSubmit() {
    this._userService.login(this.user).subscribe(
      response => {
        this.identity = response.user;
        if (!this.identity || !this.identity._id) {
          this.status = 'error';

        } else {

          //Persisistir usuario

          localStorage.setItem('identity', JSON.stringify(this.identity));

          //Conseguir token
          this.getToken();


        }
      }, error => {
        console.log(error);
        this.status = 'error';
      });
  }

  getToken() {
    this._userService.login(this.user, 'true').subscribe(
      response => {
        this.token = response.token;
        if (this.token.length <= 0) {
          this.status = 'error';


        } else {
          localStorage.setItem('token', JSON.stringify(this.token));
          this.unvieweds();
          this.getCounters();


        }
      }, error => {
        console.log(error);
        this.status = 'error';
      });
  }

  getCounters() {
    this._userService.getCounters().subscribe(
      response => {

        this.status = 'success';
        localStorage.setItem('stats', JSON.stringify(response));
        this._router.navigate(['/timeline']);

      }
      , error => {
        console.log(error);
      });
  }

  unvieweds() {
    this._messageService.getMessagesUnviewed(this.token).subscribe(response => {
      this.status = 'success';
      this.count = response.unviewed;
      localStorage.setItem('messages', JSON.stringify(response.unviewed));

    }, error => {
      console.log(error)
    })
  }

}
