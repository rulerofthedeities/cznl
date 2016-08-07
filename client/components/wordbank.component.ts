import {Component, OnInit, OnDestroy} from '@angular/core';
import {WordService} from '../services/words.service';
import {Filter} from './filter.component';
import {EditWord} from './edit-word.component';
import {Filter as FilterModel} from '../models/filters.model';
import {WordPair} from '../models/word.model';
import {Subscription} from 'rxjs/Subscription';

@Component({
  directives: [Filter, EditWord],
  template: `
    <filter 
      tpe="wordbank"
      (selectedFilter)="onSelectFilter($event)">
    </filter>
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
  filterData: FilterModel;
  words: WordPair[];
  selected: number; //shown on mouseover
  editing: number; //shown on clicked
  subscription: Subscription;

  constructor(private wordService: WordService) {}

  ngOnInit() {
    //A new word is being created
    this.subscription = this.wordService.newWordSource$.subscribe(
      isNewWord => {
        this.editing = null;
      }
    );
  }

  onSelectFilter(filter: FilterModel) {
    this.filterData = filter;
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

  getWords(filter: FilterModel) {
    this.wordService.getWords(filter, this.maxWords)
      .then(words => {
        this.words = words;
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
