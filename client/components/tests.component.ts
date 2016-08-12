import {Component, OnDestroy} from '@angular/core';
import {Filter} from './filter.component';
import {Cards} from './cards/cards.component';
import {Review} from './review.component';
import {WordLists} from './wordlists/wordlists.component';
import {WordPair} from '../models/word.model';
import {Filter as FilterModel} from '../models/filters.model';
import {WordService} from '../services/words.service';
import {WordlistService} from '../services/wordlists.service';
import {RestartService} from '../services/restart.service';
import {Subscription}   from 'rxjs/Subscription';
import {shuffle} from '../utils/utils';

@Component({
  directives: [Filter, Cards, Review, WordLists],
  providers: [WordService, WordlistService],
  template:`
  <div class="row">
    <div *ngIf="!started" class="col-xs-4">
      <ul class="btn-group-vertical btn-group-lg">
        <li 
          (click)="selectListType('filter')"
          class="btn"
          [ngClass]="{'btn-primary':listType==='filter'}">
          Willekeurige woordenlijst
        </li>
        <li 
          (click)="selectListType('dynamic')"
          class="btn"
          [ngClass]="{'btn-primary':listType==='dynamic'}">
          Dynamische woordenlijsten
        </li>
        <li 
          (click)="selectListType('wordlist')"
          class="btn"
          [ngClass]="{'btn-primary':listType==='wordlist'}">
          Mijn woordenlijsten
        </li>
      </ul>
    </div>
    <filter tpe="exercises"
      *ngIf="!started && listType=='filter'"
      (selectedFilter)="getWordsFromFilter($event)"
      class="col-xs-8">
    </filter>
    <word-lists 
      *ngIf="!started && listType=='wordlist'" 
      [created]="'user'"
      (selectedList)="getWordsFromWordList($event)"
      class="col-xs-8">
    </word-lists>
    <word-lists 
      *ngIf="!started && listType=='dynamic'" 
      [created]="'auto'"
      class="col-xs-8">
    </word-lists>
    <div *ngIf="started && exerciseTpe=='test'" class="col-xs-12">
      <cards 
        [data]="cards">
      </cards>
    </div>
    <div *ngIf="started && exerciseTpe=='review'" class="col-xs-12">
      <review 
        [words]="cards"
        (restart)="onStartTest($event)">
      </review>
    </div>
  </div>
  `,
  styles: [
  `li {cursor:pointer;}`]
})

export class Tests implements OnDestroy {
  maxWords = 20;
  listType: string = 'filter';
  started: boolean = false;
  cards: WordPair[];
  exerciseTpe:string;
  subscription: Subscription;

  constructor(
    private wordService: WordService,
    restartService: RestartService) {
    this.subscription = restartService.restartFilter$.subscribe(
      start => {
        this.restart();
      });
  }

  selectListType(tpe: string) {
    this.listType = tpe;
  }

  getWordsFromFilter(filter: FilterModel) {
    this.wordService.getWordsFromFilter(filter, this.maxWords)
      .then(words => {
        this.cards = words;
        this.exerciseTpe = filter.test;
        this.started = true;
      });
  }

  getWordsFromWordList(_id: string) {
    this.wordService.getWordsFromWordList(_id, this.maxWords)
      .then(words => {
        this.cards = words;
        this.exerciseTpe = 'review';
        this.started = true;
      });
  }

  restart() {
    shuffle(this.cards);
    this.started = false;
  }

  onStartTest(event: boolean) {
    shuffle(this.cards);
    this.exerciseTpe = 'test';
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }
}
