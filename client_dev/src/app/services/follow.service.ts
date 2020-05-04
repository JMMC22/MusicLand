import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { GLOBAL } from './global';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable()
export class FollowService {

  private url: string;
  public identity;
  public stats;


  constructor(public _http: HttpClient, private _userService: UserService) {
    this.url = GLOBAL.url;
  }

  follow(token, follow): Observable<any> {
    let params = JSON.stringify(follow);
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

    return this._http.post(this.url + 'follow', params, { headers: headers });
  }

  unFollow(token, id): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

    return this._http.delete(this.url + 'unfollow/' + id, { headers: headers });
  }

  getMyFolloweds(token): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

    return this._http.get(this.url + 'my-followed', { headers: headers })
  }

  getFollowing(token, userId = null, page = 1): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

    if (userId != null) {
      return this._http.get(this.url + 'following/' + userId + '/' + page, { headers: headers })
    } else {
      return this._http.get(this.url + 'following', { headers: headers })

    }
  }

  getFollowed(token, userId = null, page = 1): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

    if (userId != null) {
      return this._http.get(this.url + 'followed/' + userId + '/' + page, { headers: headers })
    } else {
      return this._http.get(this.url + 'followed', { headers: headers })

    }
  }
}
