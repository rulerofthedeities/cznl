import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class WordService {
  constructor(private http: Http) { }

  getWords(filter: string, maxWords: number) {
    //?f=' + filter + '&m=' + maxWords
    console.log('getting words in service', filter, maxWords);
    return this.http.get('/api/words')
      .toPromise()
      .then(response => response.json().words)
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
