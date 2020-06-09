import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from './user.service';
import { GLOBAL } from './global';
import { Observable } from 'rxjs';
import { Message } from '../models/message';

@Injectable()
export class MessageService {

  private url: string;
  public identity;
  public stats;

  constructor(public _http: HttpClient, private _userService: UserService) {
    this.url = GLOBAL.url;
  }

  create(token, message: Message): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
    let params = JSON.stringify(message);

    return this._http.post(this.url + 'message', params, { headers: headers });

  }

  message100(token): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
    let params;

    return this._http.post(this.url + 'message100', params, { headers: headers });

  }


  getReceivesMessages(token, page = 1): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

    return this._http.get(this.url + 'messages-rec/' + page, { headers: headers });
  }

  getSendsMessages(token, page = 1): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

    return this._http.get(this.url + 'messages-sends/' + page, { headers: headers });
  }

  getMessagesUnviewed(token): Observable<any> {

    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

    return this._http.get(this.url + 'unvieweds', { headers: headers });


  }

  getMessagesUnviewedAndNotify(token): Observable<any> {

    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

    return this._http.get(this.url + 'unnotify', { headers: headers });


  }

  setMessagesViewed(token, message): Observable<any> {

    let params = JSON.stringify(message);
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

    return this._http.post(this.url + 'set-viewed/' + message._id, params, { headers: headers });


  }

}
