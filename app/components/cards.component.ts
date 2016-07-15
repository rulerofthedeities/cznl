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
        [tpe]="isQuestion"
        [card]="currentCard"
        (cardCompleted)="onCardCompleted()">
      </card-item>
      <div *ngIf="isFinished">
        <h1>FINISHED</h1>
      </div>
    </div>`,
  styles: [
  `card-item {cursor:pointer;}`]
})

export class Cards implements OnInit {
  @Input('data') cards: WordPair[];
  cardsIndex = 0;
  maxCards = 20;
  isQuestion = true;
  isFinished = false;
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

  onCardCompleted() {
    this.getNextCard();
  }
}
