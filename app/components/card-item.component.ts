import {Component, Input, Output, EventEmitter, OnChanges} from '@angular/core';
import {WordPair, CardWord} from '../model/word.model';

@Component({
  selector: 'card-item',
  template: `
    <div class="card">
      <div 
        *ngIf="isQuestion"
        (click)="turnCard()"
        class="question">
        QUESTION <br>
        {{cardData.article}}<h1>{{cardData.word}}</h1>
        <em>{{cardData.genus}} / {{card.tpe}}</em>
      </div>
      <div *ngIf="!isQuestion" class="answer">
        ANSWER <br>
         {{cardData.article}}<h1>{{cardData.word}}</h1>
         <div class="button" (click)="answerCard(true)">Correct</div>
         <div class="button" (click)="answerCard(false)">Incorrect</div>
      </div>
    </div>`,
  styles: [
  `div.question, div.button {cursor:pointer;}`]
})

export class CardItem implements OnChanges {
  @Input() card: WordPair;
  @Output() cardAnswered = new EventEmitter();
  isQuestion = true;
  cardData: CardWord;

  ngOnChanges() {
    this.getCardData();
  }

  turnCard() {
    this.isQuestion = !this.isQuestion;
    this.getCardData();
  }

  answerCard(correct: boolean) {
    this.cardAnswered.emit(correct);
    this.turnCard();
  }

  getCardData() {
    this.cardData = this.isQuestion ? this.card.src : this.card.tgt;
  }
}
