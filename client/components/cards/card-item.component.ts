import {Component, Input, Output, EventEmitter, OnChanges} from '@angular/core';
import {WordPair, Word} from '../../model/word.model';

@Component({
  selector: 'card-item',
  template: `
    <div class="card center-block">
      <div 
        *ngIf="isQuestion"
        (click)="turnCard()"
        class="question text-center">
        <div class="wordwrapper center-block">
            <h2 class="word">{{cardData.word}}</h2>
        </div>
        <em>{{card.tpe}}</em>
      </div>
      <div *ngIf="!isQuestion" class="answer">
        <div class="wordwrapper center-block">
            <div class="word">{{cardData.article}}</div>
            <h2 class="word">{{cardData.word}}</h2>
        </div>
        <div class="clearfix">
          <div 
            class="btn btn-success btn-sm pull-right" 
            (click)="answerCard(true)">
            Juist
          </div>
          <div 
            class="btn btn-danger btn-sm pull-left" 
            (click)="answerCard(false)">
            Fout
          </div>
        </div>
    </div>`,
  styleUrls: ['client/components/cards/card.component.css']
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
