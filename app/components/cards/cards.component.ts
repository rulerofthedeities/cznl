import {Component, Input, OnInit} from '@angular/core';
import {SettingsService} from '../../services/settings.service';
import {CardItem} from './card-item.component';
import {CardScore} from './card-score.component';
import {WordPair} from '../../model/word.model';

@Component({
  selector: 'cards',
  directives: [CardItem, CardScore],
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
        (cardAnswered)="onCardAnswered($event)">
      </card-item>
      <card-score 
        *ngIf="isFinished"
        [correct]="correct"
        [total]="maxCards">
        <h1>FINISHED</h1>
        score: {{correct}}
      </card-score>
    </div>`
})

export class Cards implements OnInit {
  @Input('data') cards: WordPair[];
  cardsIndex = 0;
  maxCards = 20;
  progress = 0;
  isFinished = false;
  correct = 0;
  currentCard: WordPair;

  constructor(private settingsService: SettingsService) {}

  ngOnInit() {
    this.getSettings();
  }

  getSettings() {
    this.settingsService.getSettings()
      .then(settings => {
        this.maxCards = Math.min(settings.maxCards, this.cards.length);
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

  onCardAnswered(isCorrect) {
    this.getNextCard();
    if (isCorrect) {
      this.correct++;
    }
  }
}
