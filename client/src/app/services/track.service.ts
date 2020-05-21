import { Injectable } from '@angular/core';
import { GLOBAL } from './global';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from './user.service';
import { Observable } from 'rxjs';

@Injectable()
export class TrackService {

  private url: string;
  public identity;
  public stats;

  constructor(public _http: HttpClient, private _userService: UserService) {
    this.url = GLOBAL.url;
  }


  getUserTracks(token, id, page): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

    return this._http.get(this.url + 'user-tracks/' + id + '/' + page, { headers: headers });
  }

  update(token, track): Observable<any> {
    let params = JSON.stringify(track);
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

    return this._http.post(this.url + 'update-track/' + track._id, params, { headers: headers });


  }
  getTracks(token, page = null): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

    return this._http.get(this.url + 'tracks/' + page, { headers: headers });
  }

}
