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
    const token = this.authService.getToken(),
          headers = new Headers();

    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + token);

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

  getProgressStats(monthsBack: number) {
    const token = this.authService.getToken(),
          headers = new Headers();

    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + token);

    return this.http
      .get('/api/progress/' + monthsBack.toString(), {headers})
      .map(response => response.json().obj)
      .catch(error => Observable.throw(error));
  }
}
