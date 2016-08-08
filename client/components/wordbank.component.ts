import {Component, OnInit, OnDestroy} from '@angular/core';
import {WordService} from '../services/words.service';
import {FilterService} from '../services/filters.service';
import {Filter} from './filter.component';
import {EditWord} from './edit-word.component';
import {FilterWord} from '../models/filters.model';
import {WordPair} from '../models/word.model';
import {Subscription} from 'rxjs/Subscription';

@Component({
  directives: [EditWord],
  template: `
    <div class="form-inline">
      <div class="form-group">
        <label for="wordFilter" class="sr-only">Filter woord:</label>
        <input #wordFilter
          type="text"
          id="wordFilter"
          placeholder="Filter woord"
          class="form-control">
      </div>
      <div class="checkbox">
        <label><input type="checkbox" value='1' #startcb>Vanaf begin</label>
      </div>
      <button class="btn btn-success"
        (click)="searchWords(wordFilter.value, startcb.checked)">
      Toon woorden
      </button>
    <div class="text-muted">Aantal woorden: <strong>{{totalWords}}</strong></div>
    </div>
    <ul class="list-group col-xs-2"
        on-mouseout="deselectWord()">
      <li *ngFor="let word of words; let i = index" 
          class="list-group-item"
          (click)="editWord(word, i)"
          on-mouseover="selectWord(i)"
          [ngClass]="{'over': i === selected && i!==editing,'active': i === editing}">
        {{i + 1}}. {{word.cz.word}}
      </li>
    </ul>
    <div class="col-xs-10">
      <edit-word></edit-word>
    </div>
    <div class="clearfix"></div>
  `,
  styles: [`
    li {cursor:pointer;}
    .over {color:blue;}
  `]
})

export class WordBank implements OnInit, OnDestroy {
  maxWords = 100;
  words: WordPair[];
  selected: number; //shown on mouseover
  editing: number; //shown on clicked
  subscription: Subscription;
  totalWords: number;

  constructor(
    private wordService: WordService,
    private filterService: FilterService) {}

  ngOnInit() {
    //A new word is being created
    this.subscription = this.wordService.newWordSource$.subscribe(
      isNewWord => {
        this.editing = null;
      }
    );
  }

  searchWords(word: string, start: boolean) {
    let filter:FilterWord;
    filter = {
      word:word,
      start:start
    };
    this.getWords(filter);
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

  getWords(filter: FilterWord) {
    this.wordService.getFilterWords(filter, this.maxWords)
      .then(words => {
        this.words = words;
      });
    this.wordService.getCount(null, filter)
      .then(total => {
        this.totalWords = total;
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
