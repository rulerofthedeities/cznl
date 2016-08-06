import {Component} from '@angular/core';
import {WordService} from '../services/words.service';
import {Filter} from './filter.component';
import {EditWord} from './edit-word.component';
import {Filter as FilterModel} from '../models/filters.model';
import {WordPair} from '../models/word.model';

@Component({
  directives: [Filter, EditWord],
  template: `
    <filter 
      tpe="wordbank"
      (selectedFilter)="onSelectFilter($event)">
    </filter>
    <ul class="list-group col-xs-2">
      <li *ngFor="let word of words; let i = index" 
          class="list-group-item"
          (click)="editWord(word)"
          on-mouseover="selectWord(i)"
          [ngClass]="{'active': i === selected}">
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
  `]
})

export class WordBank {
  maxWords = 100;
  filterData: FilterModel;
  words: WordPair[];
  selected: number;

  constructor(private wordService: WordService) {}

  onSelectFilter(filter: FilterModel) {
    this.filterData = filter;
    this.getWords(filter);
  }
  editWord(word: WordPair) {
    this.wordService.editWord(word);
  }

  selectWord(i: number) {
    this.selected = i;
  }

  getWords(filter: FilterModel) {
    this.wordService.getWords(filter, this.maxWords)
      .then(words => {
        this.words = words;
      });
  }
}
