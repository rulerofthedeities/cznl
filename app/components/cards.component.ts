import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'cards',
  template: `
    <div>CARDS
    {{currentCard|json}}
    </div>`
})

export class Cards implements OnInit {
  @Input('data') cards: Object[];
  cardsIndex = 0;
  currentCard: Object;

  ngOnInit() {
    this.getNextCard();
  }

  getNextCard() {
    if (this.cards.length >= this.cardsIndex) {
      this.currentCard = this.cards[this.cardsIndex++];
    }
  }
}
