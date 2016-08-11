import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {Answer} from '../models/word.model';
import {WordList} from '../models/list.model';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class WordlistService {
  constructor(private http: Http) {}

  getWordLists(tpe) {
    return this.http.get('/api/wordlists/' + tpe)
      .toPromise()
      .then(response => response.json().lists)
      .catch(this.handleError);
  }

  updateWordLists(listAnswer: Answer) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http
      .put('/api/answer?tpe=listids', JSON.stringify(listAnswer), {headers: headers})
      .toPromise()
      .then(() => listAnswer)
      .catch(this.handleError);
  }

  saveList(list: WordList) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http
      .post('/api/lists/add', JSON.stringify(list), {headers: headers})
      .toPromise()
      .then(() => list)
      .catch(this.handleError);
  }

  updateList(list: WordList) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http
      .put('/api/lists/edit', JSON.stringify(list), {headers: headers})
      .toPromise()
      .then(() => list)
      .catch(this.handleError);
  }

  private handleError(error: any) {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
