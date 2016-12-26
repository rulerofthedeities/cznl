import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {Http, Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class ProgressService {

  constructor(
    private authService: AuthService,
    private http: Http
  ) {}

  updateTotalForToday(total: number) {
    let headers = new Headers();
    const token = this.authService.getToken();

    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + token);

    return this.http
      .put('/api/progress', JSON.stringify({total}), {headers})
      .map(response => response.json().obj)
      .catch(error => Observable.throw(error));
  }
}
