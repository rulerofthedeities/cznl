import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {LEVELS, TPES, GENUS, CASES} from '../data/filters';

@Injectable()
export class FilterService {

  constructor(private http: Http) { }

  getFilterOptions() {
    return this.http.get('/api/cats?search=&max=200')
      .toPromise()
      .then(response => {
        let cats = response.status === 200 ? response.json().cats: [];
        return {
        'levels': LEVELS,
        'tpes': TPES,
        'genus': GENUS,
        'cases': CASES,
        'cats': cats};
      })
      .catch(this.handleError);
  }

  private handleError(error: any) {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

}
