import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Filter} from './filter.component';
import {WordPair} from '../models/word.model';
import {Filter as FilterModel} from '../models/filters.model';
import {WordService} from '../services/words.service';
import {RestartService} from '../services/restart.service';
import {AuthService} from '../services/auth.service';
import {ErrorService} from '../services/error.service';
import {SettingsService} from '../services/settings.service';
import {UtilsService} from '../services/utils.service';
import {Subscription}   from 'rxjs/Subscription';

@Component({
  template:`
  <section>
    <div class="row">
      <div *ngIf="!started" class="col-xs-4">
        <ul class="btn-group-vertical btn-group-lg">
          <li 
            (click)="selectListType('filter')"
            class="btn"
            [ngClass]="{'btn-primary':listType==='filter'}">
            Filter woordenlijst
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
        (selectedUserList)="getWordsFromUserList($event)"
        class="col-xs-8">
      </word-lists>
      <word-lists 
        *ngIf="!started && listType=='dynamic'" 
        (selectedUserList)="getWordsFromAutoList($event)"
        [created]="'auto'"
        class="col-xs-8">
      </word-lists>
      <div *ngIf="started && exerciseTpe=='test'" class="col-xs-12">
        <cards-test
          [data]="cards">
        </cards-test>
      </div>
      <div *ngIf="started && exerciseTpe=='review'" class="col-xs-12">
        <review 
          [words]="cards"
          (restart)="onStartTest($event)">
        </review>
      </div>
      <div *ngIf="started && exerciseTpe=='practise'" class="col-xs-12">
        <cards-practise 
          [data]="cards">
        </cards-practise>
      </div>
    </div>
  </section>
  `,
  styles: [
  `li {cursor:pointer;}`]
})

export class Tests implements OnInit, OnDestroy {
  maxWords = 20;
  listType: string = 'filter';
  started: boolean = false;
  cards: WordPair[];
  exerciseTpe:string;
  subscription: Subscription;

  constructor(
    private authService: AuthService,
    private wordService: WordService,
    private errorService: ErrorService,
    private settingsService: SettingsService,
    private utilsService: UtilsService,
    private route: ActivatedRoute,
    restartService: RestartService
  ) {
    this.subscription = restartService.restartFilter$.subscribe(
      start => {
        this.restart();
      });
  }

  ngOnInit() {
    //access required for menu
    if (!this.authService.getUserAccess()) {
      this.authService.setUserAccess(this.route.snapshot.data['access']);
    }

    this.settingsService.getAppSettings().subscribe(
      settings => {
        if (settings && settings.all) {
          this.maxWords = settings.all.maxWords;
        }
      },
      error => this.errorService.handleError(error)
    );
  }

  selectListType(tpe: string) {
    this.listType = tpe;
  }

  getWordsFromFilter(filter: FilterModel) {
    this.wordService.getWordsFromFilter(filter, this.maxWords).subscribe(
      words => {
        this.cards = words;
        this.exerciseTpe = filter.test;
        this.started = true;
      },
      error => this.errorService.handleError(error)
    );
  }

  getWordsFromUserList(data: any) {
    this.wordService.getWordsFromWordList(data.selected._id, this.maxWords).subscribe(
      words => {
        this.cards = words;
        this.exerciseTpe = data.exerciseTpe;
        this.started = true;
      },
      error => this.errorService.handleError(error)
    );
  }

  getWordsFromAutoList(data: any) {
    this.wordService.getWordsFromAutoList(data.selected.id, this.maxWords).subscribe(
      words => {
        this.cards = words;
        this.exerciseTpe = data.exerciseTpe;
        this.started = true;
      },
      error => this.errorService.handleError(error)
    );
  }

  restart() {
    this.utilsService.shuffle(this.cards);
    this.started = false;
  }

  onStartTest(event: boolean) {
    this.cards = this.utilsService.shuffle(this.cards);
    this.exerciseTpe = 'test';
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
