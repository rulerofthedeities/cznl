import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {Http, Headers} from '@angular/http';
import {WordList} from '../models/list.model';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class WordlistService {
  constructor(
    private authService: AuthService,
    private http: Http
  ) {}

  getWordLists(listTpe: string) {
    const token = this.authService.getToken(),
          headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + token);
    return this.http
      .get('/api/lists/' + listTpe, {headers})
      .map(response => response.json().lists)
      .catch(error => Observable.throw(error));
  }

  updateWordList(isInList: boolean, userListId: string, wordId: string) {
    const listUpdate = {isInList, userListId, wordId},
          token = this.authService.getToken(),
          headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + token);
    return this.http
      .put('/api/lists/words', JSON.stringify(listUpdate), {headers})
      .map(response => listUpdate)
      .catch(error => Observable.throw(error));
  }

  saveList(list: WordList) {
    const token = this.authService.getToken(),
          headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + token);
    return this.http
      .post('/api/lists/add', JSON.stringify(list), {headers})
      .map(response => response.json().obj)
      .catch(error => Observable.throw(error));
  }

  updateListName(list: WordList) {
    const token = this.authService.getToken(),
          headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + token);
    return this.http
      .put('/api/lists/edit', JSON.stringify(list), {headers})
      .map(response => list)
      .catch(error => Observable.throw(error));
  }
}
