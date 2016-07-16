import {Component} from '@angular/core';
import {Filter} from './common/filter.component';
import {Cards} from './cards/cards.component';
import {WordPair} from '../model/word.model';
import {WordService} from '../services/words.service';

@Component({
  selector: 'tests',
  directives: [Filter, Cards],
  providers: [WordService],
  template:`
  <h1>Word tests</h1>
  <ul>
    <li (click)="selectListType('default')">Selecteer woordenlijst</li>
    <li (click)="selectListType('user')">Mijn woordenlijst</li>
  </ul>
  <filter *ngIf="!started"
    [tpe]="listType"
    (selectedFilter)="onSelectFilter($event)">
  </filter>
  <div *ngIf="started">
    Filter data: {{filterData|json}}
    <cards [data]="cards">
    </cards>
  </div>

  `,
  styles: [
  `li {cursor:pointer;}`]
})

export class Tests {
  listType: string = 'default';
  filterData: Object;
  started: boolean = false;
  cards: WordPair[];

  constructor(private wordService: WordService) {}

  selectListType(tpe) {
    this.listType = tpe;
  }

  onSelectFilter(filter: Object) {
    this.filterData = filter;
    this.getWords(filter);
  }

  getWords(filter) {
    this.wordService.getWords(filter)
      .then(wordlist => {
        this.cards = wordlist;
        this.started = true;
      });
  }
}
