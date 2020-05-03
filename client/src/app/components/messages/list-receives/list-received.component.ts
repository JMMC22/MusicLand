import { Component, OnInit, DoCheck } from '@angular/core';
import { Message } from 'src/app/models/message';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'src/app/services/message.service';
import { GLOBAL } from 'src/app/services/global';

@Component({
  selector: 'app-list-received',
  templateUrl: './list-message.component.html'
})
export class ListReceivedComponent implements OnInit{

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
    this._messageService.getReceivesMessages(this.token, page).subscribe(response => {
      if (!response.messages) {
        this.status = 'error';
      } else {
        console.log(response)
        this.total = response.total;
        this.messages = response.messages;
        this.pages = response.pages;
        if (page > this.pages) {
          this._router.navigate(['/messages-received/1']);
        }
        this.getMessagesUnViewed();
      }
    }, error => {
      console.log(error);
      this.status = 'error';
    })
  }

  setViewed(message) {
    if (!message.unviewed) {
      message.unviewed = true;
      this._messageService.setMessagesViewed(this.token, message).subscribe(
        response => {
          message.unviewed = true;
          this.getMessagesReceived(this.page);

        }, error => {
          console.log(error)
        }
      )
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
