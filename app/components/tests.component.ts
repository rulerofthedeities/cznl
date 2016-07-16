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
  <div class="row">
    <div *ngIf="!started" class="col-xs-4">
      <ul class="btn-group-vertical btn-group-sm">
        <li 
          (click)="selectListType('default')"
          class="btn"
          [ngClass]="{'btn-primary':listType==='default'}">
          Selecteer woordenlijst
        </li>
        <li 
          (click)="selectListType('user')"
          class="btn"
          [ngClass]="{'btn-primary':listType==='user'}">
          Mijn woordenlijst
        </li>
      </ul>
    </div>
    <filter *ngIf="!started"
      [tpe]="listType"
      (selectedFilter)="onSelectFilter($event)"
      class="col-xs-8">
    </filter>
    <div *ngIf="started" class="col-xs-12">
      Filter data: {{filterData|json}}
      <cards [data]="cards">
      </cards>
    </div>
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
