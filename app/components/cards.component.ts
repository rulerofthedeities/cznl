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
      <div *ngIf="currentCard">
        <card-item 
          [tpe]="isQuestion ? 'question' : 'answer'"
          [card]="currentCard">
        </card-item>
      </div>
    </div>`
})

export class Cards implements OnInit {
  @Input('data') cards: WordPair[];
  cardsIndex = 0;
  maxCards = 20;
  isQuestion = true;
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
    if (this.cards.length >= this.cardsIndex) {
      this.currentCard = this.cards[this.cardsIndex++];
    }
  }
}
