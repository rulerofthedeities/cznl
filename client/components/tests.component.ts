import {Component, OnDestroy} from '@angular/core';
import {Filter} from './filter.component';
import {Cards} from './cards/cards.component';
import {Review} from './review.component';
import {WordPair} from '../models/word.model';
import {Filter as FilterModel} from '../models/filters.model';
import {WordService} from '../services/words.service';
import {RestartService} from '../services/restart.service';
import {Subscription}   from 'rxjs/Subscription';
import {shuffle} from '../utils/utils';

@Component({
  directives: [Filter, Cards, Review],
  providers: [WordService],
  template:`
  <div class="row">
    <div *ngIf="!started" class="col-xs-4">
      <ul class="btn-group-vertical btn-group-lg">
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
          Mijn woordenlijsten
        </li>
      </ul>
    </div>
    <filter *ngIf="!started"
      [tpe]="listType"
      (selectedFilter)="onSelectFilter($event)"
      class="col-xs-8">
    </filter>
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
  listType: string = 'default';
  filterData: FilterModel;
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

  onSelectFilter(filter: FilterModel) {
    this.filterData = filter;
    this.getWords(filter);
  }

  getWords(filter: FilterModel) {
    this.wordService.getWords(filter, this.maxWords)
      .then(wordlist => {
        this.cards = wordlist;
        this.exerciseTpe = filter.test;
        if (filter.test === 'review') {
          this.fetchAnswers();
        } else {
          this.started = true;
        }
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

  fetchAnswers() {
    //If review is started without a test beforehand, fetch previous answers from db
    let wordIds: string[] = [];
    const answersAssoc: { [id: string]: boolean; } = { };

    this.cards.forEach(card => {wordIds.push(card._id);});
    this.wordService.getAnswers(wordIds)
      .then(answers => {
        //Match answers with the words in this.cards
        answers.forEach(function(answer) {answersAssoc[answer.wordId] = answer.correct;});
        this.cards.forEach(card => {card.correct = answersAssoc[card._id];});
    });

    this.started = true;
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }
}
