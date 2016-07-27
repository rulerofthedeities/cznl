import {Injectable} from '@angular/core';
import {Settings} from '../model/settings.model';
import {Http, Headers} from '@angular/http';

@Injectable()
export class SettingsService {

  constructor(private http: Http) {}

  getSettings() {
    return this.http.get('/api/settings')
      .toPromise()
      .then (response => response.json().settings)
      .catch(this.handleError);
  }

  setSettings(newSettings: Settings) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http
      .put('/api/settings', JSON.stringify(newSettings), {headers: headers})
      .toPromise()
      .then(() => newSettings)
      .catch(this.handleError);
  }

  private handleError(error: any) {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
