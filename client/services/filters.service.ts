import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {Http, Headers} from '@angular/http';
import {LEVELS, TPES, GENUS, CASES} from '../data/filters';
import {Observable} from 'rxjs/Observable';
import {Cat} from '../models/filters.model';

@Injectable()
export class FilterService {

  constructor(
    private authService: AuthService,
    private http: Http
  ) {}

  getFilterOptions() {
    const token = this.authService.getToken();
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + token);
    return this.http
      .get('/api/cats?search=&max=250', {headers})
      .map(response => {
        let cats = response.status === 200 ? response.json().cats: [];
        return {
        'levels': LEVELS,
        'tpes': TPES,
        'genus': GENUS,
        'cases': CASES,
        'cats': this.catsToPropercase(cats)};
      })
      .catch(error => Observable.throw(error));
  }

  private catsToPropercase(arr: Cat[]) {
    return arr.map(cat => {
      return {'name': cat.name[0].toUpperCase() + cat.name.substring(1), 'total': cat.total};
    });
  }

}
