import {Injectable} from '@angular/core';
import {Http, RequestOptions, Headers, Request, RequestMethod} from '@angular/http';
import {Filter} from '../models/filters.model';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class WordService {
  constructor(private http: Http) { }

  getWords(filter: Filter, maxWords: number) {
    return this.http.get('/api/words?l=' + filter.level + '&t=' + filter.tpe + '&c=' + filter.cats + '&m=' + maxWords)
      .toPromise()
      .then(response => response.json().words)
      .catch(this.handleError);
  }

  getCount(filter:Filter) {
    return this.http.get('/api/words?cnt=1&l=' + filter.level + '&t=' + filter.tpe + '&c=' + filter.cats)
      .toPromise()
      .then(response => response.json().total)
      .catch(this.handleError);
  }

  getAnswers(wordIds:string[]) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    let options = new RequestOptions({
        method: RequestMethod.Post,
        url: '/api/answers',
        headers: headers,
        body: JSON.stringify(wordIds)
    });

    return this.http.request(new Request(options))
      .toPromise()
      .then(response => response.json().answers)
      .catch(this.handleError);
  }

  saveAnswer(userId: string, wordId: string, correct: boolean) {
    let headers = new Headers(),
        answer = {userId: userId, wordId: wordId, correct: correct};
    headers.append('Content-Type', 'application/json');
    return this.http
      .put('/api/answer', JSON.stringify(answer), {headers: headers})
      .toPromise()
      .then(() => answer)
      .catch(this.handleError);
  }

  private handleError(error: any) {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

}
