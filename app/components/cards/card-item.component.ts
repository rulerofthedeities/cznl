import {Component, Input, Output, EventEmitter, OnChanges} from '@angular/core';
import {WordPair, Word} from '../../model/word.model';

@Component({
  selector: 'card-item',
  template: `

<div class="col-xs-10 col-xs-offset-1">

    <div class="w3-card-4">
      <div 
        *ngIf="isQuestion"
        (click)="turnCard()"
        class="question caption">
        {{cardData.article}}<h4>{{cardData.word}}</h4>
        <em>{{card.tpe}}</em>
      </div>
      <div *ngIf="!isQuestion" class="answer">
        {{cardData.article}}<h4>{{cardData.word}}</h4>
        {{cardData.genus}}
        <div 
          class="btn btn-success btn-xs pull-right" 
          (click)="answerCard(true)">
          Correct
        </div>
        <div 
          class="btn btn-danger btn-xs pull-right" 
          (click)="answerCard(false)">
          Incorrect
        </div>
      </div>
    </div>`,
  styles: [`
    .card {
      padding:12px;
      
    }
    div.question {cursor:pointer;}
    div.answer .btn {margin:3px}
  `]
})

export class CardItem implements OnChanges {
  @Input() card: WordPair;
  @Output() cardAnswered = new EventEmitter();
  isQuestion = true;
  cardData: Word;

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
    this.cardData = this.isQuestion ? this.card.nl : this.card.cz;
  }
}
