import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import {User, UserLocal, UserAccess} from '../models/user.model';

@Injectable()
export class AuthService {
  private accessLocal: UserAccess = null;

  constructor (private http: Http) {}

  getToken(): string {
    return localStorage.getItem('km-osdt.token');
  }

  signup(user: User) {
    const body = JSON.stringify(user);
    const headers = new Headers({'Content-Type': 'application/json'});
    return this.http.post('/api/user/signup', body, {headers})
      .map(response => response.json().obj)
      .catch(error => Observable.throw(error.json()));
  }

  signin(user: User) {
    const body = JSON.stringify(user);
    const headers = new Headers({'Content-Type': 'application/json'});
    return this.http.post('/api/user/signin', body, {headers})
      .map(response => response.json().obj)
      .catch(error => Observable.throw(error.json()));
  }

  logout() {
    localStorage.clear();
  }

  isLoggedIn() {
    return localStorage.getItem('km-cznl.token') !== null;
  }

  getUserName() {
    return localStorage.getItem('km-cznl.userName');
  }

  setUserAccess(data: UserAccess) {
    this.accessLocal = data;
  }

  getUserAccess() {
    return this.accessLocal;
  }

  storeUserData(data: UserLocal) {
    localStorage.setItem('km-cznl.token', data.token);
    localStorage.setItem('km-cznl.userId', data.userId);
    localStorage.setItem('km-cznl.userName', data.userName);
  }

  fetchUserAccess() {
    const token = this.getToken();
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + token);
    return this.http.get('/api/user/access', {headers, body: ''})
      .map(response => response.json().obj)
      .catch(error => Observable.throw(error));
  }

}
