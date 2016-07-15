import {Component, Input, OnInit} from '@angular/core';
import {SettingsService} from '../services/settings.service';
import {CardItem} from './card-item.component';
import {WordPair} from '../model/word.model';

@Component({
  selector: 'cards',
  directives: [CardItem],
  providers: [SettingsService],
  template: `
    <div>CARDS
      <div>{{cardsIndex}}/{{maxCards}}</div>
      <card-item 
        *ngIf="currentCard"
        [card]="currentCard"
        (cardAnswered)="onCardAnswered($event)">
      </card-item>
      <div *ngIf="isFinished">
        <h1>FINISHED</h1>
        score: {{correct}}
      </div>
    </div>`
})

export class Cards implements OnInit {
  @Input('data') cards: WordPair[];
  cardsIndex = 0;
  maxCards = 20;
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
        this.maxCards = settings.maxCards;
        this.getNextCard();
      });
  }

  getNextCard() {
    if (this.cardsIndex < this.cards.length) {
      this.currentCard = this.cards[this.cardsIndex++];
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
