import {Component, Input, Output, EventEmitter, OnChanges} from '@angular/core';
import {WordPair, CardWord} from '../model/word.model';

@Component({
  selector: 'card-item',
  template: `
    <div class="card" (click)="turnCard()">
      <div *ngIf="isQuestion" class="question">
        QUESTION <br>
        {{cardData.article}}<h1>{{cardData.word}}</h1>
        <em>{{cardData.genus}} / {{card.tpe}}</em>
      </div>
      <div *ngIf="!isQuestion" class="answer">
        QUESTION <br>
         {{cardData.article}}<h1>{{cardData.word}}</h1>
      </div>
    </div>
    <br>`
})

export class CardItem implements OnChanges {
  @Input('tpe') isQuestion:boolean = true;
  @Input() card: WordPair;
  @Output() cardCompleted = new EventEmitter();
  cardData: CardWord;

  ngOnChanges() {
    this.getCardData();
  }

  turnCard() {
    this.isQuestion = !this.isQuestion;
    this.getCardData();
    if (this.isQuestion) {
      this.cardCompleted.emit(null);
    }
  }

  getCardData() {
    this.cardData = this.isQuestion ? this.card.src : this.card.tgt;
  }
}
