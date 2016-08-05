import {Component} from '@angular/core';
import {WordService} from '../services/words.service';
import {Filter} from './filter.component';
import {Filter as FilterModel} from '../models/filters.model';
import {WordPair} from '../models/word.model';

@Component({
  directives: [Filter],
  template: `
    <filter 
      tpe="wordbank"
      (selectedFilter)="onSelectFilter($event)"
      (filterCount)="onChangedFilter($event)">
    </filter>
    <ul>
      <li *ngFor="let word of words; let i = index">
        {{i + 1}}. {{word.cz.word}}
      </li>
    </ul>
  `
})

export class WordBank {
  maxWords = 100;
  filterData: FilterModel;
  totalWords: number;
  words: WordPair[];

  constructor(private wordService: WordService) {}

  onSelectFilter(filter: FilterModel) {
    this.filterData = filter;
    this.getWords(filter);
  }

  onChangedFilter(total: number) {
    this.totalWords = total;
  }

  getWords(filter: FilterModel) {
    this.wordService.getWords(filter, this.maxWords)
      .then(words => {
        this.words = words;
      });
  }
}
