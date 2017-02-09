import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {Http, Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {WordPair} from '../models/word.model';

@Injectable()
export class ProgressService {

  constructor(
    private authService: AuthService,
    private http: Http
  ) {}

  updateTotalsForToday(cards: WordPair[]) {
    let headers = new Headers();
    const token = this.authService.getToken();

    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + token);

    console.log(cards,
      cards.filter(card => card.answer.review === true),
      cards.filter(card => card.answer.review !== true),
      cards.filter(card => card.answer.review === false));

    const obj = {
      total: cards.length,
      correct: cards.filter(card => card.answer.correct === true).length,
      incorrect: cards.filter(card => card.answer.correct !== true).length,
      review: cards.filter(card => card.answer.review === true).length,
      new: cards.filter(card => card.answer.review !== true).length
    };

    return this.http
      .put('/api/progress', JSON.stringify(obj), {headers})
      .map(response => response.json().obj)
      .catch(error => Observable.throw(error));
  }

  getProgressStats() {
    let headers = new Headers();
    const token = this.authService.getToken();

    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + token);

    return this.http
      .get('/api/progress', {headers})
      .map(response => response.json().obj)
      .catch(error => Observable.throw(error));
  }
}
