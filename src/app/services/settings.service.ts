import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {AllSettings} from '../models/settings.model';
import {Filter} from '../models/filters.model';
import {Http, Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class SettingsService {

  constructor(
    private authService: AuthService,
    private http: Http
  ) {}

  getAppSettings() {
    const token = this.authService.getToken(),
          headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + token);
    return this.http
      .get('/api/settings?tpe=all', {headers})
      .map(response => response.json().obj)
      .catch(error => Observable.throw(error));
  }

  setAppSettings(newSettings: AllSettings) {
    const token = this.authService.getToken(),
          headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + token);
    return this.http
      .put('/api/settings?tpe=all', JSON.stringify(newSettings), {headers})
      .map(response => response.json().obj)
      .catch(error => Observable.throw(error));
  }

  getFilterSettings() {
    const token = this.authService.getToken(),
          headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + token);
    return this.http
      .get('/api/settings?tpe=filter', {headers})
      .map(response => response.json().obj)
      .catch(error => Observable.throw(error));
  }

  setFilterSettings(newFilter: Filter) {
    const token = this.authService.getToken(),
          headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + token);
    return this.http
      .put('/api/settings?tpe=filter', JSON.stringify({filter: newFilter}), {headers})
      .map(response => response.json().obj)
      .catch(error => Observable.throw(error));
  }
}
