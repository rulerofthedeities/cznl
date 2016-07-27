import {Component, OnDestroy} from '@angular/core';
import {Filter} from './common/filter.component';
import {Cards} from './cards/cards.component';
import {WordPair} from '../model/word.model';
import {WordService} from '../services/words.service';
import {RestartService} from '../services/restart.service';
import {Subscription}   from 'rxjs/Subscription';

@Component({
  selector: 'tests',
  directives: [Filter, Cards],
  providers: [WordService, RestartService],
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
      <cards 
        [data]="cards">
      </cards>
    </div>
  </div>
  `,
  styles: [
  `li {cursor:pointer;}`]
})

export class Tests implements OnDestroy {
  maxWords = 20;
  listType: string = 'default';
  filterData: Object;
  started: boolean = false;
  cards: WordPair[];
  subscription: Subscription;

  constructor(
    private wordService: WordService,
    restartService: RestartService) {
    this.subscription = restartService.restartFilter$.subscribe(
      start => {
        this.restart();
      });
  }

  selectListType(tpe) {
    this.listType = tpe;
  }

  onSelectFilter(filter: Object) {
    this.filterData = filter;
    this.getWords(filter);
  }

  getWords(filter) {
    this.wordService.getWords(filter, this.maxWords)
      .then(wordlist => {
        this.cards = wordlist;
        this.started = true;
      });
  }

  restart() {
    this.started = false;
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }
}
