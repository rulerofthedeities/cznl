import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {WordService} from '../services/words.service';
import {ErrorService} from '../services/error.service';
import {AuthService} from '../services/auth.service';
import {FilterWord} from '../models/filters.model';
import {WordPair} from '../models/word.model';
import 'rxjs/add/operator/takeWhile';

@Component({
  templateUrl: 'wordbank.component.html',
  styles: [`
    li {cursor:pointer;}
    .over {color:blue;}
    .scroll {overflow: auto;height: 100%;}
  `]
})

export class WordBankComponent implements OnInit, OnDestroy {
  maxWords = 1000;
  words: WordPair[];
  selected: number; // shown on mouseover
  editing: number; // shown on clicked
  totalWords: number;
  componentActive = true;

  constructor(
    private wordService: WordService,
    private errorService: ErrorService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // A new word is being created
    this.wordService.newWordSource$
    .takeWhile(() => this.componentActive)
    .subscribe(
      isNewWord => {
        this.editing = null;
      }
    );
  }

  searchWords(word: string, start: boolean) {
    let filter: FilterWord;
    filter = {
      word: word,
      start: start
    };
    this.getWords(filter);
    this.selected = null;
    this.editing = null;
  }

  editWord(word: WordPair, i) {
    this.editing = i;
    this.selected = null;
    this.wordService.editWord(word);
  }

  selectWord(i: number) {
    this.selected = i;
  }

  deselectWord() {
    this.selected = null;
  }

  onWordUpdated(word) {
    if (this.editing) {
      this.words[this.editing] = word;
    }
  }

  getWords(filter: FilterWord) {
    this.wordService.getFilterWords(filter, this.maxWords)
    .takeWhile(() => this.componentActive)
    .subscribe(
      words => { this.words = words; },
      error => this.errorService.handleError(error)
    );
    this.wordService.getCount(null, filter)
    .takeWhile(() => this.componentActive)
    .subscribe(
      total => { this.totalWords = total; },
      error => this.errorService.handleError(error)
    );
  }

  ngOnDestroy() {
    this.componentActive = false;
  }
}
