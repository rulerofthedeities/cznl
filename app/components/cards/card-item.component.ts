import {Component, Input, Output, EventEmitter, OnChanges} from '@angular/core';
import {WordPair, Word} from '../../model/word.model';

@Component({
  selector: 'card-item',
  template: `

<div class="col-xs-10 col-xs-offset-1">

    <div class="card center-block">
      <div 
        *ngIf="isQuestion"
        (click)="turnCard()"
        class="question">
        <div class="wordwrapper center-block">
            <h2 class="word">{{cardData.word}}</h2>
        </div>
        <div class="text-center">
          <em>{{card.tpe}}</em>
        </div>
      </div>
      <div *ngIf="!isQuestion" class="answer">
        <div class="wordwrapper center-block">
            <div class="word">{{cardData.article}}</div>
            <h2 class="word">{{cardData.word}}</h2>
        </div>
        <div class="clearfix">
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
      </div>
    </div>`,
  styles: [`
    .wordwrapper {
      display: table;
      margin-top: 20px;
      margin-bottom: 20px;
    }
    .word {
      display: table-cell; 
      vertical-align: bottom;
    }
    h2.word {
      padding-left:3px;
    }
    .tall{
      font-size: 20px;
    }
    .card {
      box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
      transition: 0.3s;
      border-radius: 5px;
      border: 1px solid #ddd;
      padding: 12px;
      max-width: 240px;
    }
    .card:hover {
      box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
    }
    div.question {cursor:pointer;}
    div.answer .btn {margin:20px 6px 3px 3px;}
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
