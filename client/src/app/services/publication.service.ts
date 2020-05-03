import { Injectable } from '@angular/core';
import { GLOBAL } from './global';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from './user.service';
import { Observable } from 'rxjs';

@Injectable()
export class PublicationService {

  private url: string;
  public identity;
  public stats;

  constructor(public _http: HttpClient, private _userService: UserService) {
    this.url = GLOBAL.url;
  }

  create(token, publication): Observable<any> {
    let params = JSON.stringify(publication);
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

    return this._http.post(this.url + 'publication', params, { headers: headers });
  }

  getPublicationsTimeline(token, page = 1): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

    return this._http.get(this.url + 'publications/' + page, { headers: headers });
  }
  getPublicationsUser(token, user_id, page = 1): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

    return this._http.get(this.url + 'publications-user/' + user_id + '/' + page, { headers: headers });
  }

  delete(token, id): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

    return this._http.delete(this.url + 'publication/' + id, { headers: headers });
  }

  getTop3PublicationsSongs(token): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

    return this._http.get(this.url + 'get-top3songs', { headers: headers });
  }
}
