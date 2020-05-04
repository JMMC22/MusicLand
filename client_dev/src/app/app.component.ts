import { Component, OnInit, DoCheck } from '@angular/core';
import { UserService } from './services/user.service';
import { Router } from '@angular/router';
import { MessageService } from './services/message.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService]
})
export class AppComponent implements OnInit, DoCheck {
  title = 'client';
  public identity;
  public stats;
  public token;
  public count;
  public count2;

  constructor(private _userService: UserService, private _router: Router, private _messageService: MessageService) {

  }

  ngOnInit() {
    this.identity = this._userService.getIdentity();
    this.stats = this._userService.getStats();

  }

  ngDoCheck() {
    this.identity = this._userService.getIdentity();
    this.stats = this._userService.getStats();
    this.count = this._userService.getMessages();


  }

  logout() {
    localStorage.clear();
    this.identity = null;
    this._router.navigate(['/home']);
  }




}
