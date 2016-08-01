import {Component, Input, OnInit} from '@angular/core';
import {SettingsService} from '../../services/settings.service';
import {CardItem} from './card-item.component';
import {CardScore} from './card-score.component';
import {Review} from '../review.component';
import {WordPair} from '../../models/word.model';
import {shuffle} from '../../utils/utils';
import {Subscription}   from 'rxjs/Subscription';

@Component({
  selector: 'cards',
  directives: [CardItem, CardScore, Review],
  providers: [SettingsService],
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
        *ngIf="isFinished && !isReview"
        [correct]="correct"
        [total]="maxCards"
        (restart)="onRestart($event)"
        (review)="onReview($event)">
      </card-score>
      <review 
        *ngIf="isReview"
        [words]="cards"
        (restart)="onRestart($event)">
      </review>
    </div>`
})

export class Cards implements OnInit {
  @Input('data') cards: WordPair[];
  maxCards: number;
  cardsIndex:number;
  isFinished: boolean;
  isReview: boolean;
  correct: number;
  progress: number;
  currentCard: WordPair;
  subscription: Subscription;
  settings: Object;

  constructor(private settingsService: SettingsService) {}

  ngOnInit() {
    this.reset();
    this.getSettings();
  }

  getSettings() {
    this.settingsService.getAppSettings()
      .then(settings => {
        this.maxCards = Math.min(settings.all.maxWords, this.cards.length);
        this.settings = settings.all;
        this.getNextCard();
      });
  }

  getNextCard() {
    if (this.cardsIndex < this.cards.length) {
      this.currentCard = this.cards[this.cardsIndex++];
      this.progress = Math.trunc(this.cardsIndex / this.maxCards * 100);
    } else {
      this.currentCard = null;
      this.isFinished = true;
    }
  }

  onCardAnswered(isCorrect: boolean) {
    this.cards[this.cardsIndex - 1].answer.correct = isCorrect;
    this.getNextCard();
    if (isCorrect) {
      this.correct++;
    }
  }

  onRestart(isRestart: boolean) {
    this.reset();
    shuffle(this.cards);
    this.getNextCard();
  }

  onReview(isReview: boolean) {
    this.isReview = true;
  }

  reset() {
    this.isFinished = false;
    this.isReview = false;
    this.progress = 0;
    this.correct = 0;
    this.cardsIndex = 0;
  }
}
