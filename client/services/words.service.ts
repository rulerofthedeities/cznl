import {Injectable} from '@angular/core';
import {Http, RequestOptions, Headers, Request, RequestMethod} from '@angular/http';
import {Filter} from '../models/filters.model';
import 'rxjs/add/operator/toPromise';
import {TPES} from '../data/filters';
import {Subject} from 'rxjs/Subject';
import {WordPair, Word, FormWordPair} from '../models/word.model';

@Injectable()
export class WordService {
  private editWordSource = new Subject<WordPair>();

  editWordSource$ = this.editWordSource.asObservable();

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

  addWord(word:FormWordPair) {
    let headers = new Headers(),
        data: Object,
        wordPair: WordPair;

    wordPair = this.buildWordPair(word);
    data = {userId:'demoUser', word:wordPair};
    headers.append('Content-Type', 'application/json');

    return this.http
      .post('/api/words', JSON.stringify(data), {headers: headers})
      .toPromise()
      .then(() => data)
      .catch(this.handleError);
  }

  editWord(word:WordPair) {
    this.editWordSource.next(word);
  }

  updateWord(word:FormWordPair) {
    let headers = new Headers(),
        data: Object,
        wordPair: WordPair;

    wordPair = this.buildWordPair(word);
    data = {userId:'demoUser', word:wordPair};
    headers.append('Content-Type', 'application/json');

    return this.http
      .put('/api/words', JSON.stringify(data), {headers: headers})
      .toPromise()
      .then(() => data)
      .catch(this.handleError);
  }

  buildWordPair(word: FormWordPair): WordPair {
    //Transform form data into a valid WordPair object
    let wordPair = <WordPair>{},
        wordCz = <Word>{},
        wordNl = <Word>{};

    wordPair._id = word._id;
    wordPair.tpe = word.tpe;

    wordPair.level = parseInt(word.level, 10);
    if (word.categories.length > 0) {
      let cats:string[] = word.categories.toString().split(',');
      cats = cats.map(word => word.trim().toLowerCase());
      wordPair.categories = cats;
    }

    wordCz.word = word['cz.word'];
    wordNl.word = word['nl.word'];
    if (word.tpe === 'noun') {
      wordCz.genus = word['cz.genus'];
      wordNl.article = word['nl.article'];
    }
    wordPair.cz = wordCz;
    wordPair.nl = wordNl;

    return wordPair;
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

  searchCategories(search: string) {
    return this.http.get('/api/cats?search=' + search)
      .toPromise()
      .then(response => {return response.status === 200 ? response.json(): null;})
      .catch(this.handleError);
  }

  processWords(words, answers) {
    const answersAssoc: { [id: string]: boolean; } = { };
    answers.forEach(function(answer) {
      answersAssoc[answer.wordId] = answer;
    });

    words.forEach(word => {
      //Add answers data to word object
      if (answersAssoc[word._id]) {
        word.answer = answersAssoc[word._id];
        delete word.answer.wordId;
      }
      //Translate word type from English to Dutch
      //word.tpe_nl = this.getTpeTranslation(word.tpe);
      word.tpe = word.tpe;
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
