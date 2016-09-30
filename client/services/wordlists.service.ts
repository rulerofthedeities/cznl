import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {Http, Headers} from '@angular/http';
import {WordList} from '../models/list.model';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class WordlistService {
  constructor(
    private authService: AuthService,
    private http: Http
  ) {}

  getWordLists(listTpe: string) {
    const token = this.authService.getToken();
    return this.http.get('/api/lists/' + listTpe + token)
      .toPromise()
      .then(response => response.json().lists)
      .catch(this.handleError);
  }

  updateWordList(isInList: boolean, userListId: string, wordId: string) {
    const listUpdate = {isInList, userListId, wordId},
          token = this.authService.getToken();
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http
      .put('/api/lists/words' + token, JSON.stringify(listUpdate), {headers: headers})
      .toPromise()
      .then(() => listUpdate)
      .catch(this.handleError);
  }

  saveList(list: WordList) {
    let headers = new Headers();
    const token = this.authService.getToken();
    headers.append('Content-Type', 'application/json');
    return this.http
      .post('/api/lists/add' + token, JSON.stringify(list), {headers: headers})
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  updateListName(list: WordList) {
    let headers = new Headers();
    const token = this.authService.getToken();
    headers.append('Content-Type', 'application/json');
    return this.http
      .put('/api/lists/edit' + token, JSON.stringify(list), {headers: headers})
      .toPromise()
      .then(() => list)
      .catch(this.handleError);
  }

  private handleError(error: any) {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
