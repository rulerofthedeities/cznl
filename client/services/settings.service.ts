import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {AllSettings} from '../models/settings.model';
import {Filter} from '../models/filters.model';
import {Http, Headers} from '@angular/http';

@Injectable()
export class SettingsService {

  constructor(
    private authService: AuthService,
    private http: Http
  ) {}

  getAppSettings() {
    const token = this.authService.getToken();
    return this.http.get('/api/settings' + token + '&tpe=all')
      .toPromise()
      .then (response => response.json().settings)
      .catch(this.handleError);
  }

  setAppSettings(newSettings: AllSettings) {
    const token = this.authService.getToken();
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http
      .put('/api/settings' + token + '&tpe=all', JSON.stringify(newSettings), {headers: headers})
      .toPromise()
      .then(() => newSettings)
      .catch(this.handleError);
  }

  getFilterSettings() {
    const token = this.authService.getToken();
    return this.http.get('/api/settings' + token + '&tpe=filter')
      .toPromise()
      .then (response => response.json().settings)
      .catch(this.handleError);
  }

  setFilterSettings(newFilter: Filter) {
    const token = this.authService.getToken();
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http
      .put('/api/settings' + token + '&tpe=filter', JSON.stringify(newFilter), {headers: headers})
      .toPromise()
      .then(() => newFilter)
      .catch(this.handleError);
  }

  private handleError(error: any) {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
