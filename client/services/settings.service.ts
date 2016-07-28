import {Injectable} from '@angular/core';
import {Settings} from '../model/settings.model';
import {Http, Headers} from '@angular/http';
import {Filter} from '../model/filters.model';

@Injectable()
export class SettingsService {

  constructor(private http: Http) {}

  getAppSettings() {
    return this.http.get('/api/settings?tpe=all')
      .toPromise()
      .then (response => response.json().settings)
      .catch(this.handleError);
  }

  setAppSettings(newSettings: Settings) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http
      .put('/api/settings?tpe=all', JSON.stringify(newSettings), {headers: headers})
      .toPromise()
      .then(() => newSettings)
      .catch(this.handleError);
  }

  getFilterSettings() {
    return this.http.get('/api/settings?tpe=filter')
      .toPromise()
      .then (response => response.json().settings)
      .catch(this.handleError);
  }

  setFilterSettings(newFilter: Filter) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http
      .put('/api/settings?tpe=filter', JSON.stringify(newFilter), {headers: headers})
      .toPromise()
      .then(() => newFilter)
      .catch(this.handleError);

  }

  private handleError(error: any) {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
