import { Component, OnInit } from '@angular/core';
import { Message } from 'src/app/models/message';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'src/app/services/message.service';
import { GLOBAL } from 'src/app/services/global';

@Component({
  selector: 'app-list-sent',
  templateUrl: './list-message-sent.component.html'
})
export class ListSentComponent implements OnInit {

  public identity;
  public token;
  public stats;
  public status;
  public messages: Message[];
  public page;
  public next_page;
  public prev_page;
  public pages;
  public total;
  public url;
  public count;

  constructor(private _userService: UserService, private _route: ActivatedRoute, private _messageService: MessageService, private _router: Router) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.stats = this._userService.getStats();
    this.page = 1;
    this.url = GLOBAL.url;

  }

  ngOnInit() {
    this.actualPage();
  }

  actualPage() {
    this._route.params.subscribe(params => {

      let page = +params['page'];
      this.page = page;

      if (!+params['page']) {
        page = 1;
      }

      this.page = page;


      if (!page) {
        page = 1;
      } else {
        this.next_page = page + 1;
        this.prev_page = page - 1;

        if (this.prev_page <= 0) {
          this.prev_page = 1;
        }
      }
      //Devolver usuarios
      this.getMessagesReceived(page);
    });
  }

  getMessagesReceived(page) {
    this._messageService.getSendsMessages(this.token, page).subscribe(response => {
      if (!response.messages) {
        this.status = 'error';
      } else {
        console.log(response.messages)
        this.total = response.total;
        this.messages = response.messages;
        this.pages = response.pages;
        if (page > this.pages) {
          this._router.navigate(['/messages-sent/1']);
        }
        this.getMessagesUnViewed();
      }
    }, error => {
      console.log(error);
      this.status = 'error';
    })
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
