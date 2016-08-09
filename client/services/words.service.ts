import {Injectable} from '@angular/core';
import {Http, RequestOptions, Headers, Request, RequestMethod} from '@angular/http';
import {Filter, FilterWord} from '../models/filters.model';
import 'rxjs/add/operator/toPromise';
import {TPES} from '../data/filters';
import {Subject} from 'rxjs/Subject';
import {WordPair, Word, FormWordPair} from '../models/word.model';

@Injectable()
export class WordService {
  private editWordSource = new Subject<WordPair>();
  private newWordSource = new Subject<boolean>();

  editWordSource$ = this.editWordSource.asObservable();
  newWordSource$ = this.newWordSource.asObservable();

  constructor(private http: Http) { }

  getWords(filter: Filter, maxWords: number) {
    let url = '/api/words?a=1&l=' + filter.level + '&t=' + filter.tpe + '&c=' + filter.cats + '&m=' + maxWords;

    return this.http.get(url)
      .toPromise()
      .then(response => {
          let words = response.json().words;
          let answers = response.json().answers;
          return this.processWords(words, answers);
        })
      .catch(this.handleError);
  }

  getFilterWords(filter: FilterWord, maxWords: number) {
    let url = '/api/words?a=0&wf=1&w=' + filter.word + '&m=' + maxWords;
    url+= filter.start ? '&s=1' : '';
    return this.http.get(url)
      .toPromise()
      .then(response => {
          return response.json().words;
        })
      .catch(this.handleError);
  }

  getCount(filter:Filter, wordFilter?:FilterWord) {
    let url = '/api/words?cnt=1';
    if (wordFilter) {
      url+= '&wf=1';
      url+= '&w=' + wordFilter.word;
      url+= wordFilter.start ? '&s=1' : '';
    } else {
      url+= '&l=' + filter.level + '&t=' + filter.tpe + '&c=' + filter.cats;
    }
    return this.http.get(url)
      .toPromise()
      .then(response => response.json().total)
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

  newWord() {
    this.newWordSource.next(true);
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
        wordCzP = <Word>{}, //Perfective
        wordNl = <Word>{};

    wordPair._id = word._id;
    wordPair.tpe = word.tpe;

    wordPair.level = parseInt(word.level, 10);
    if (word.categories && word.categories.length > 0) {
      let cats:string[] = word.categories.toString().split(',');
      cats = cats.map(word => word.trim().toLowerCase());
      wordPair.categories = cats;
    }

    wordCz.word = word['cz.word'];
    wordNl.word = word['nl.word'];
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
    }
    if (word.tpe === 'prep' || word.tpe === 'verb') {
      wordCz.case = word['cz.case'];
    }
    if (word.tpe === 'verb') {
      if (word['czP.word']) {wordCzP.word = word['czP.word'];}
      if (word['czP.case']) {wordCzP.case = word['czP.case'];}
      if (word['czP.otherwords']) {wordCzP.otherwords = word['czP.otherwords'];}
      if (word['czP.hint']) {wordCzP.hint = word['czP.hint'];}
      if (word['czP.info']) {wordCzP.info = word['czP.info'];}
      if (word['czP.firstpersonsingular']) {wordCzP.firstpersonsingular = word['czP.firstpersonsingular'];}
      if (word['czP.word']) {wordPair.czP = wordCzP;}
    }
    wordPair.cz = wordCz;
    wordPair.nl = wordNl;

    return wordPair;
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
