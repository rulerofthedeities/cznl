import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {UtilsService} from './utils.service';
import {Http, Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Cat} from '../models/filters.model';

@Injectable()
export class FilterService {

  constructor(
    private authService: AuthService,
    private utilsService: UtilsService,
    private http: Http
  ) {}

  getFilterOptions() {
    const token = this.authService.getToken(),
          headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + token);
    return this.http
      .get('/api/cats?search=&max=250', {headers})
      .map(response => {
        const filterCats = response.status === 200 ? response.json().cats : [];
        return {
        'levels': this.utilsService.getFilter('levels'),
        'tpes': this.utilsService.getFilter('tpes'),
        'genus': this.utilsService.getFilter('genus'),
        'cases': this.utilsService.getFilter('cases'),
        'cats': this.catsToPropercase(filterCats)};
      })
      .catch(error => Observable.throw(error));
  }

  private catsToPropercase(arr: Cat[]) {
    return arr.map(cat => {
      return {
        'name': cat.name[0].toUpperCase() + cat.name.substring(1),
        'total': cat.total
      };
    });
  }

}
