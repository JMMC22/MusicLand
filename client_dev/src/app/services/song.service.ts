import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from './user.service';
import { GLOBAL } from './global';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SongService {

  private url: string;
  public identity;
  public stats;

  constructor(public _http: HttpClient, private _userService: UserService) {
    this.url = GLOBAL.url;
  }


  getAllSongs(token): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

    return this._http.get(this.url + 'songs', { headers: headers });
  }

  create(token, song): Observable<any> {
    let params = JSON.stringify(song);

    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

    return this._http.post(this.url + 'song', params, { headers: headers });


  }

  getSongs(token, page = null): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token).set('Set-Cookie','HttpOnly;Secure;SameSite=None');

    return this._http.get(this.url + 'songs/' + page, { headers: headers });
  }

  getSong(token, id): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

    return this._http.get(this.url + 'song/' + id, { headers: headers });
  }

  update(token, song): Observable<any> {
    let params = JSON.stringify(song);
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

    return this._http.put(this.url + 'update-song/' + song._id, params, { headers: headers });
  }

  delete(token, id): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

    return this._http.delete(this.url + 'song/' + id, { headers: headers });
  }

  search(token, query, page = null): Observable<any> {

    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

    return this._http.get(this.url + 'songs-search/' + query + '/' + page, { headers: headers });

  }
}
