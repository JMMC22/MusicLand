import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from './user.service';
import { GLOBAL } from './global';
import { Observable } from 'rxjs';

@Injectable()
export class ArtistService {

  private url: string;
  public identity;
  public stats;

  constructor(public _http: HttpClient, private _userService: UserService) {
    this.url = GLOBAL.url;
  }


  create(token, song): Observable<any> {
    let params = JSON.stringify(song);
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

    return this._http.post(this.url +'artist', params, { headers: headers });


  }

  getArtists(token, page = null): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

    return this._http.get(this.url +'artists/' + page, { headers: headers });
  }

  getAllArtists(token): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

    return this._http.get(this.url +'all-artists', { headers: headers });
  }

  getArtist(token, id): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

    return this._http.get(this.url +'artist/' + id, { headers: headers });
  }

  update(token, artist): Observable<any> {
    let params = JSON.stringify(artist);
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

    return this._http.put(this.url +'update-artist/' + artist._id, params, { headers: headers });
  }

  delete(token, id): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

    return this._http.delete(this.url +'artist/' + id, { headers: headers });
  }

  search(token, nombre, page = null): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

    return this._http.get(this.url +'search-artist/' + nombre + '/' + page, { headers: headers });
  }
}
