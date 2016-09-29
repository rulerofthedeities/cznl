import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import {User, UserLocal} from '../models/user.model';

@Injectable()
export class AuthService {
  constructor (private http: Http) {}

  getToken(): string {
    return localStorage.getItem('km-osdt.token') ? '?token=' + localStorage.getItem('km-osdt.token') : '';
  }

  signup(user: User) {
    const body = JSON.stringify(user);
    const headers = new Headers({'Content-Type': 'application/json'});
    return this.http.post('/api/user/signup', body, {headers: headers})
      .map(response => response.json().obj)
      .catch(error => Observable.throw(error.json()));
  }

  signin(user: User) {
    const body = JSON.stringify(user);
    const headers = new Headers({'Content-Type': 'application/json'});
    return this.http.post('/api/user/signin', body, {headers: headers})
      .map(response => response.json().obj)
      .catch(error => Observable.throw(error.json()));
  }

  logout() {
    localStorage.clear();
  }

  isLoggedIn() {
    return localStorage.getItem('km-osdt.token') !== null;
  }

  getUserName() {
    return localStorage.getItem('km-osdt.userName');
  }

  storeUserData(data: UserLocal) {
    localStorage.setItem('km-osdt.token', data.token);
    localStorage.setItem('km-osdt.userId', data.userId);
    localStorage.setItem('km-osdt.userName', data.userName);
  }

}
