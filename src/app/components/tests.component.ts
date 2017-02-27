import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Filter} from './filter.component';
import {WordPair} from '../models/word.model';
import {Filter as FilterModel} from '../models/filters.model';
import {WordService} from '../services/words.service';
import {AuthService} from '../services/auth.service';
import {ErrorService} from '../services/error.service';
import {SettingsService} from '../services/settings.service';
import {TestService} from '../services/test.service';
import {UtilsService} from '../services/utils.service';
import {CardsTestComponent} from './cards/cards-test.component';
import 'rxjs/add/operator/takeWhile';
import {Observable} from 'rxjs/Observable';

@Component({
  templateUrl: 'tests.component.html',
  styles: [
    `li {cursor:pointer;}`
  ]
})

export class TestsComponent implements OnInit, OnDestroy {
  @ViewChild(CardsTestComponent) cardsTest: CardsTestComponent;
  maxWords = 20;
  listType = 'filter';
  started = false;
  cards: WordPair[];
  exerciseTpe = '';
  showModalBox = false;
  componentActive = true;

  constructor(
    private authService: AuthService,
    private wordService: WordService,
    private errorService: ErrorService,
    private settingsService: SettingsService,
    private utilsService: UtilsService,
    private testService: TestService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // access required for menu
    if (!this.authService.getUserAccess()) {
      this.authService.setUserAccess(this.route.snapshot.data['access']);
    }
    this.getSettings();

    this.testService.start
    .takeWhile(() => this.componentActive)
    .subscribe(
      testTpe => {
        if (testTpe === 'newtest') {
          this.backToFilter();
        } else {
          if (testTpe !== 'review') {
            this.cards = this.utilsService.shuffle(this.cards);
          }
          this.exerciseTpe = testTpe;
        }
      }
    );

    this.testService.stop
    .takeWhile(() => this.componentActive)
    .subscribe(
      () => {
        this.showModalBox = true;
        this.testService.saveresults
        .takeWhile(() => this.componentActive)
        .subscribe(
          () => {
            // Go back to review
            this.testService.doStart('review');
          }
        );
      }
    );
  }

  canDeactivate(): Observable<boolean>|boolean {
    // Only show a modal box if this is a test and it is not finished (score view)
    const isFinished = this.cardsTest && this.cardsTest.isFinished;
    if (this.exerciseTpe === 'test' && !isFinished) {
      this.showModalBox = true;
      return this.testService.saveresults
      .takeWhile(() => this.componentActive).first();
    } else {
      return true;
    }
  }

  selectListType(tpe: string) {
    this.listType = tpe;
  }

  backToFilter() {
    this.getSettings();
    this.showModalBox = false;
    this.exerciseTpe = '';
    this.started = false;
    this.listType = 'filter';
  }

  onStopConfirmed(stopOk: boolean) {
    if (stopOk) {
      // Save uncompleted result
      this.testService.doSaveResults();
    }
    this.showModalBox = false;
  }

  getWordsFromFilter(filter: FilterModel) {
    this.wordService
    .getWordsFromFilter(filter, this.maxWords)
    .takeWhile(() => this.componentActive)
    .subscribe(
      words => {
        this.cards = words;
        this.exerciseTpe = filter.test;
        this.started = true;
      },
      error => this.errorService.handleError(error)
    );
  }

  getWordsFromUserList(data: any) {
    this.wordService
    .getWordsFromWordList(data.selected._id, this.maxWords)
    .takeWhile(() => this.componentActive)
    .subscribe(
      words => {
        this.cards = words;
        this.exerciseTpe = data.exerciseTpe;
        this.started = true;
      },
      error => this.errorService.handleError(error)
    );
  }

  getWordsFromAutoList(data: any) {
    this.wordService
    .getWordsFromAutoList(data.selected.id, this.maxWords)
    .takeWhile(() => this.componentActive)
    .subscribe(
      words => {
        this.cards = words;
        this.exerciseTpe = data.exerciseTpe;
        this.started = true;
      },
      error => this.errorService.handleError(error)
    );
  }

  getSettings() {
    this.settingsService
    .getAppSettings()
    .takeWhile(() => this.componentActive)
    .subscribe(
      settings => {
        if (settings && settings.all) {
          this.maxWords = settings.all.maxWords;
        }
      },
      error => this.errorService.handleError(error)
    );
  }

  ngOnDestroy() {
    this.componentActive = false;
  }
}
