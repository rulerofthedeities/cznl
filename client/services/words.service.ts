import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {Http, Headers} from '@angular/http';
import {Filter, FilterWord} from '../models/filters.model';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {WordPair, Word} from '../models/word.model';


@Injectable()
export class WordService {
  private editWordSource = new Subject<WordPair>();
  private newWordSource = new Subject<boolean>();

  editWordSource$ = this.editWordSource.asObservable();
  newWordSource$ = this.newWordSource.asObservable();

  constructor(
    private authService: AuthService,
    private http: Http
  ) {}

  getWordsFromFilter(filter: Filter, maxWords: number) {
    const url = '/api/words?a=1&l=' + filter.level + '&t=' + filter.tpe + '&c=' + filter.cats + '&m=' + maxWords;
    return this._getWordsAndAnswers(url);
  }

  getWordsFromWordList(_id:string, maxWords: number) {
    let url = '/api/words?listid=' + _id + '&m=' + maxWords;
    return this._getWordsAndAnswers(url);
  }

  getWordsFromAutoList(id:string, maxWords: number) {
    let url = '/api/words?autoid=' + id + '&m=' + maxWords;
    return this._getWordsAndAnswers(url);
  }

  _getWordsAndAnswers(url: string) {
    const token = this.authService.getToken();
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + token);
    return this.http
      .get(url, {headers})
      .map(response => {
          let words = response.json().obj.words;
          let answers = response.json().obj.answers;
          return this.processWords(words, answers);})
      .catch(error => Observable.throw(error));
  }

  getFilterWords(filter: FilterWord, maxWords: number) {
    //Filter the list of words with regex on specific word
    const token = this.authService.getToken();
    let url = '/api/words?a=0&wf=1&w=' + filter.word + '&m=' + maxWords,
        headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + token);
    url+= filter.start ? '&s=1' : '';
    return this.http
      .get(url, {headers})
      .map(response => response.json().words)
      .catch(error => Observable.throw(error));
  }

  getCount(filter:Filter, wordFilter?:FilterWord) {
    const token = this.authService.getToken();
    let url = '/api/words?cnt=1',
        headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + token);
    if (wordFilter) {
      url+= '&wf=1';
      url+= '&w=' + wordFilter.word;
      url+= wordFilter.start ? '&s=1' : '';
    } else {
      url+= '&l=' + filter.level + '&t=' + filter.tpe + '&c=' + filter.cats;
    }
    return this.http
      .get(url, {headers})
      .map(response => response.json().total)
      .catch(error => Observable.throw(error));
  }

  addWord(word:WordPair) {
    let headers = new Headers(),
        data: Object,
        wordPair: WordPair;
    const token = this.authService.getToken();

    wordPair = this.cleanWord(word);
    data = {word:wordPair};
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + token);

    return this.http
      .post('/api/words', JSON.stringify(data), {headers})
      .map(response => response.json().obj)
      .catch(error => Observable.throw(error));
  }

  updateWord(word:WordPair) {
    let headers = new Headers(),
        data: Object;
    const token = this.authService.getToken();

    word = this.cleanWord(word);
    data = {word:word};
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + token);
    return this.http
      .put('/api/words', JSON.stringify(data), {headers})
      .map(response => word)
      .catch(error => Observable.throw(error));
  }

  saveAnswer(userId: string, wordId: string, answerId: string, correct: boolean) {
    let headers = new Headers();
    const token = this.authService.getToken(),
          answer = {userId, wordId, answerId, correct};
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + token);
    return this.http
      .put('/api/answer', JSON.stringify(answer), {headers})
      .map(response => response.json().obj)
      .catch(error => Observable.throw(error));
  }

  searchCategories(search: string) {
    const token = this.authService.getToken();
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + token);
    return this.http
      .get('/api/cats?search=' + search, {headers})
      .map(response => {return response.status === 200 ? response.json().cats: null;})
      .catch(error => Observable.throw(error));
  }

  checkIfWordExists(search: string) {
    const token = this.authService.getToken();
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + token);
    return this.http
      .get('/api/words/check?search=' + search, {headers})
      .map(response => response.json().obj)
      .catch(error => Observable.throw(error));
  }

  processWords(words, answers) {
    const answersAssoc: { [id: string]: boolean; } = { };
    if (answers) {
      answers.forEach(function(answer) {
        answersAssoc[answer.wordId] = answer;
      });
    }

    if (words) {
      words.forEach(word => {
        //Add answers data to word object
        if (answersAssoc[word._id]) {
          word.answer = answersAssoc[word._id];
          delete word.answer.wordId;
        }
        word.tpe = word.tpe;
        word.cz.article = this.getCardArticle(word.cz.genus);
      });
    }

    return words;
  }

  newWord() {
    this.newWordSource.next(true);
  }

  editWord(word:WordPair) {
    this.editWordSource.next(word);
  }

  getCardArticle(genus: string) {
    let article: string;
    switch (genus) {
      case 'Ma':
      case 'Mi': article = 'ten'; break;
      case 'F': article = 'ta'; break;
      case 'N': article = 'to'; break;
      default: article = '';
    }

    return article;
  }

  cleanWord(word: WordPair): WordPair {
    //Clear unnecessary fields so as not to pollute db data
    let wordPair = <WordPair>{},
        wordCz = <Word>{},
        wordCzP = <Word>{}, //Perfective
        wordNl = <Word>{},
        wordNlP = <Word>{}; //Perfective

    if (word._id) {wordPair._id = word._id;}
    wordPair.tpe = word.tpe;
    wordPair.perfective = word.tpe === 'verb' ? word.perfective : false;

    wordPair.level = parseInt(word.level, 10);
    if (word.categories && word.categories.length > 0) {
      let cats:string[] = word.categories.toString().split(',');
      cats = cats.map(word => word.trim().toLowerCase());
      wordPair.categories = cats;
    }

    wordCz.word = word['cz.word'].trim();
    wordNl.word = word['nl.word'].trim();
    if (word['cz.otherwords']) {wordCz.otherwords = word['cz.otherwords'];}
    if (word['cz.hint']) {wordCz.hint = word['cz.hint'];}
    if (word['cz.info']) {wordCz.info = word['cz.info'];}
    if (word['nl.otherwords']) {wordNl.otherwords = word['nl.otherwords'];}
    if (word['nl.hint']) {wordNl.hint = word['nl.hint'];}
    if (word['nl.info']) {wordNl.info = word['nl.info'];}
    if (word['cz.firstpersonsingular']) {wordCz.firstpersonsingular = word['cz.firstpersonsingular'];}
    if (word.tpe === 'noun') {
      wordCz.genus = word['cz.genus'];
      wordNl.article = word['nl.article'];
      if (word['cz.plural']) {wordCz.plural = word['cz.plural'];}
    }
    if (word.tpe === 'prep' || word.tpe === 'verb') {
      wordCz.case = word['cz.case'];
    }
    if (word.tpe === 'verb') {
      if (word['czP.word']) {wordCzP.word = word['czP.word'].trim();}
      if (word['czP.case']) {wordCzP.case = word['czP.case'];}
      if (word['czP.otherwords']) {wordCzP.otherwords = word['czP.otherwords'];}
      if (word['czP.hint']) {wordCzP.hint = word['czP.hint'];}
      if (word['czP.info']) {wordCzP.info = word['czP.info'];}
      if (word['czP.firstpersonsingular']) {wordCzP.firstpersonsingular = word['czP.firstpersonsingular'];}
      if (word['czP.word']) {wordPair.czP = wordCzP;}
      if (word['nlP.word']) {wordNlP.word = word['nlP.word'];}
      if (word['nlP.otherwords']) {wordNlP.otherwords = word['nlP.otherwords'];}
      if (word['nlP.hint']) {wordNlP.hint = word['nlP.hint'];}
      if (word['nlP.info']) {wordNlP.info = word['nlP.info'];}
      if (word['nlP.word']) {wordPair.nlP = wordNlP;}
    }
    wordPair.cz = wordCz;
    wordPair.nl = wordNl;

    return wordPair;
  }
}
