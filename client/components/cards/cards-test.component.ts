import {Component, Input, OnInit} from '@angular/core';
import {SettingsService} from '../../services/settings.service';
import {ErrorService} from '../../services/error.service';
import {UtilsService} from '../../services/utils.service';
import {TestService} from '../../services/test.service';
import {ProgressService} from '../../services/progress.service';
import {WordPair} from '../../models/word.model';
import {AllSettings} from '../../models/settings.model';
import {Subscription}   from 'rxjs/Subscription';

@Component({
  selector: 'cards-test',
  template: `
    <div>
      <div 
        class="text-center progress"
        *ngIf="!isFinished">
        <div 
          class="progress-bar" 
          role="progressbar" 
          [attr.aria-valuenow]="progress"
          aria-valuemin="0" 
          aria-valuemax="100" 
          [style.width.%]="progress">
          <span>
            {{cardsIndex}}/{{maxCards}}
          </span>
        </div>
      </div>
      <card-item 
        *ngIf="currentCard"
        [card]="currentCard"
        [settings]="settings"
        (cardAnswered)="onCardAnswered($event)">
      </card-item>
      <card-score 
        *ngIf="isFinished"
        [correct]="correct"
        [total]="maxCards">
      </card-score>
    </div>`
})

export class CardsTest implements OnInit {
  @Input('data') cards: WordPair[];
  maxCards: number;
  cardsIndex: number;
  isFinished: boolean;
  correct: number;
  progress: number;
  currentCard: WordPair;
  subscription: Subscription;
  settings: AllSettings;

  constructor(
    private settingsService: SettingsService,
    private utilsService: UtilsService,
    private testService: TestService,
    private progressService: ProgressService,
    private errorService: ErrorService
  ) {}

  ngOnInit() {
    this.reset();
    this.getSettings();
    this.testService.start.subscribe(
      testTpe => {
        if (testTpe === 'test') {
          this.reset();
          this.getNextCard();
        }
      }
    );
  }

  getSettings() {
    this.settingsService.getAppSettings().subscribe(
      settings => {
        this.maxCards = Math.min(settings.all.maxWords, this.cards.length);
        this.settings = settings.all;
        this.getNextCard();
      },
      error => this.errorService.handleError(error)
    );
  }

  getNextCard() {
    if (this.cardsIndex < this.cards.length) {
      this.currentCard = this.cards[this.cardsIndex++];
      this.progress = Math.trunc(this.cardsIndex / this.maxCards * 100);
    } else {
      this.currentCard = null;
      this.isFinished = true;
      //Save user statistics
      this.progressService.updateTotalForToday(this.cards.length).subscribe(
        progress => {;},
        error => {this.errorService.handleError(error);}
      );
    }
  }

  onCardAnswered(isCorrect: boolean) {
    let card:WordPair = this.cards[this.cardsIndex - 1];
    if (!card.answer) {
      card.answer = {_id:null};
    }
    this.cards[this.cardsIndex - 1].answer.correct = isCorrect;
    this.getNextCard();
    if (isCorrect) {
      this.correct++;
    }
  }

  reset() {
    this.isFinished = false;
    this.progress = 0;
    this.correct = 0;
    this.cardsIndex = 0;
  }
}
