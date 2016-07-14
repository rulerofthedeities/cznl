import {Component, Input, OnInit} from '@angular/core';
import {WordPair, CardWord} from '../model/word.model';

@Component({
  selector: 'card-item',
  template: `
    <div>
      {{cardData.article}}<h1>{{cardData.word}}</h1>
      <em>{{cardData.genus}} / {{cardData.tpe}}</em>
    </div>
    {{card |json}}`
})

export class CardItem implements OnInit {
  @Input('tpe') cardType:string = 'question';
  @Input() card: WordPair;
  cardData: CardWord;

  ngOnInit() {
    this.cardData = this.cardType === 'question' ? this.card.src : this.card.tgt;
    this.cardData.tpe = this.card.tpe;
  }
}
