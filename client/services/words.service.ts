import {Injectable} from '@angular/core';
import {Http, RequestOptions, Headers, Request, RequestMethod} from '@angular/http';
import {Filter} from '../models/filters.model';
import 'rxjs/add/operator/toPromise';
import {TPES} from '../data/filters';

@Injectable()
export class WordService {
  constructor(private http: Http) { }

  getWords(filter: Filter, maxWords: number) {
    return this.http.get('/api/words?l=' + filter.level + '&t=' + filter.tpe + '&c=' + filter.cats + '&m=' + maxWords)
      .toPromise()
      .then(response => {
          let words = response.json().words;
          let answers = response.json().answers;
          return this.processWords(words, answers);
        })
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

  processWords(words, answers) {
    const answersAssoc: { [id: string]: boolean; } = { };
    answers.forEach(function(answer) {
      answersAssoc[answer.wordId] = answer;
    });

    words.forEach(word => {
      //Add answers data to word object
      word.answer = answersAssoc[word._id];
      delete word.answer.wordId;
      //Translate word type from English to Dutch
      word.tpe = this.getTpeTranslation(word.tpe);
      word.cz.article = this.getCardArticle(word.cz.genus);
    });

    return words;
  }

  getTpeTranslation(tpe: string) {
    let nl_tpe = '', i = 0;
    while (!nl_tpe && i < TPES.length) {
      if (TPES[i].val === tpe) {
        nl_tpe = TPES[i].label;
      }
      i++;
    }
    return nl_tpe;
  }

  getCardArticle(genus: string) {
    let article: string;
    switch (genus) {
      case 'Ma':
      case 'Mi': article = 'ten'; break;
      case 'F': article = 'ta'; break;
      case 'O': article = 'to'; break;
      default: article = '';
    }

    return article;
  }

  private handleError(error: any) {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

}
