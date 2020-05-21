import { Injectable } from '@angular/core';
import { GLOBAL } from './global';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/user';
import { Observable } from 'rxjs';

@Injectable()
export class UserService {

  private url: string;
  public identity;
  public token;
  public stats;
  public messages;
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });


  constructor(public _http: HttpClient) {
    this.url = GLOBAL.url;
  }

  register(user_to_register: User): Observable<any> {
    let params = JSON.stringify(user_to_register);

    return this._http.post(this.url + 'register', params, { headers: this.httpHeaders })
  }

  login(user, gettoken = null): Observable<any> {

    if (gettoken != null) {
      user.gettoken = gettoken;
    }

    let params = JSON.stringify(user);

    return this._http.post(this.url + 'login', params, { headers: this.httpHeaders })


  }

  getIdentity() {
    let identity = JSON.parse(localStorage.getItem('identity'));

    if (identity != undefined) {
      this.identity = identity;

    } else {
      this.identity = null;
    }
    return this.identity;
  }

  getToken() {
    let token = JSON.parse(localStorage.getItem('token'));

    if (token != undefined) {
      this.token = token;

    } else {
      this.token = null;
    }
    return this.token;
  }

  getStats() {
    let stats = JSON.parse(localStorage.getItem('stats'));
    if (stats != undefined) {
      this.stats = stats;

    } else {
      this.stats = null;
    }
    return this.stats;
  }
  getMessages() {
    let messages = JSON.parse(localStorage.getItem('messages'));

    if (messages != undefined) {
      this.messages = messages;

    } else {
      this.messages = null;
    }
    return this.messages;
  }

  getCounters(userId = null): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', this.getToken());

    if (userId != null) {
      return this._http.get(this.url + 'counters/' + userId, { headers: headers });
    } else {
      return this._http.get(this.url + 'counters', { headers: headers });

    }
  }

  getUsers(page = null): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', this.getToken());

    return this._http.get(this.url + 'users/' + page, { headers: headers });
  }

  getUser(id): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', this.getToken());

    return this._http.get(this.url + 'user/' + id, { headers: headers });
  }

  getByUsername(username, page = 1): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', this.getToken());

    return this._http.get(this.url + 'users-search/' + username + '/' + page, { headers: headers });
  }

  updateUser(user): Observable<any> {
    let params = JSON.stringify(user);
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', this.getToken());

    return this._http.put(this.url + 'update-user/' + user._id, params, { headers: headers });

  }

  delete(token, id): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

    return this._http.delete(this.url + 'user/' + id, { headers: headers });
  }

  getUsersRecommended(): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', this.getToken());

    return this._http.get(this.url + 'similar-users', { headers: headers });
  }

  getAllUsers(): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', this.getToken());

    return this._http.get(this.url + 'all-users', { headers: headers });
  }
}
