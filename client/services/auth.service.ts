import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Http, Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {tokenNotExpired} from 'angular2-jwt';
import {JwtHelper} from 'angular2-jwt';
import 'rxjs/Rx';
import {User, UserLocal, UserAccess} from '../models/user.model';

@Injectable()
export class AuthService {
  private accessLocal: UserAccess = null;
  private jwtHelper: JwtHelper = new JwtHelper();

  constructor (
    private http: Http,
    private router: Router
  ) {}

  getToken(): string {
    return localStorage.getItem('km-cznl.token');
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

  signedIn(data: any) {
    let userData: UserLocal,
        userAccess: UserAccess = {level: 1, roles: []},
        decoded = this.jwtHelper.decodeToken(data.token);
    userData = {
      token: data.token,
      userId: decoded.user._id,
      userName: decoded.user.userName
    };
    userAccess = {
      level: decoded.user.access.level,
      roles: decoded.user.access.roles
    };
    this.storeUserData(userData);
    this.setUserAccess(userAccess);
    this.router.navigateByUrl('/tests');
  }

  logout() {
    this.clearStorage();
    this.router.navigate(['/auth/signin']);
  }

  isLoggedIn() {
    return !!tokenNotExpired('km-cznl.token');
  }

  getUserName() {
    return localStorage.getItem('km-cznl.userName');
  }

  setUserAccess(data: UserAccess) {
    this.accessLocal = data;
  }

  getUserAccess(): UserAccess {
    return this.accessLocal;
  }

  hasRole(role: string) {
    const access: UserAccess = this.getUserAccess();
    let hasRole = false;
    if (role && access && access.roles) {
      for (let i = 0; i < access.roles.length; i++) {
        if (access.roles[i].toLowerCase() === role.toLowerCase()) {
          hasRole = true;
        }
      }
    }
    return hasRole;
  }

  keepTokenFresh() {
    const token = this.getToken(),
          decoded = this.jwtHelper.decodeToken(token),
          initialSecs = decoded.exp - decoded.iat,
          currentSecs = decoded.exp - Math.floor(Date.now() / 1000);

    console.log('Secs since token created', initialSecs - currentSecs);
    if (initialSecs - currentSecs >= 3600) {
      //renew token if it is older than an hour
      this.refreshToken().subscribe(
        token => {
          console.log('received new token');
          localStorage.setItem('km-cznl.token', token);
        }
      );
    }
  }

  storeUserData(data: UserLocal) {
    localStorage.setItem('km-cznl.token', data.token);
    localStorage.setItem('km-cznl.userId', data.userId);
    localStorage.setItem('km-cznl.userName', data.userName);
  }

  clearStorage() {
    localStorage.removeItem('km-cznl.token');
    localStorage.removeItem('km-cznl.userId');
    localStorage.removeItem('km-cznl.userName');
  }

  fetchUserAccess() {
    const token = this.getToken();
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + token);
    return this.http
      .get('/api/user/access', {headers})
      .map(response => response.json().obj)
      .catch(error => Observable.throw(error));
  }

  refreshToken() {
    const token = this.getToken();
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + token);
    return this.http
      .patch('/api/user/refresh', {}, {headers})
      .map(response => response.json().obj)
      .catch(error => Observable.throw(error));
  }

}
