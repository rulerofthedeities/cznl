import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class WordlistService {
  constructor(private http: Http) {}

  getWordLists() {
    return this.http.get('/api/wordlists')
      .toPromise()
      .then(response => response.json().lists)
      .catch(this.handleError);
  }

  private handleError(error: any) {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
