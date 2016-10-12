import {Component, OnInit, OnDestroy} from '@angular/core';
import {WordService} from '../services/words.service';
import {ErrorService} from '../services/error.service';
import {FilterWord} from '../models/filters.model';
import {WordPair} from '../models/word.model';
import {Subscription} from 'rxjs/Subscription';

@Component({
  template: `
    <section>
      <div class="row">
        <div class="form-inline col-xs-12">
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
      </div>

      <div class="row">
        <ul class="list-group col-xs-2 scroll"
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
          <edit-word
            (updatedWord)="onWordUpdated($event)">
          </edit-word>
        </div>
        <div class="clearfix"></div>
      </div>
    </section>
  `,
  styles: [`
    li {cursor:pointer;}
    .over {color:blue;}
    .scroll {overflow: auto;height: 100%;}
  `]
})

export class WordBank implements OnInit, OnDestroy {
  maxWords = 1000;
  words: WordPair[];
  selected: number; //shown on mouseover
  editing: number; //shown on clicked
  subscription: Subscription;
  totalWords: number;

  constructor(
    private wordService: WordService,
    private errorService: ErrorService) {}

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
    this.wordService.getFilterWords(filter, this.maxWords).subscribe(
      words => {this.words = words;},
      error => this.errorService.handleError(error)
    );
    this.wordService.getCount(null, filter).subscribe(
      total => {this.totalWords = total;},
      error => this.errorService.handleError(error)
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
