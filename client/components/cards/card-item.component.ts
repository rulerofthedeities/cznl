import {Component, Input, Output, EventEmitter, OnChanges,
  trigger, style, transition, animate, keyframes} from '@angular/core';
import {WordPair, Word} from '../../models/word.model';
import {AllSettings} from '../../models/settings.model';
import {WordService} from '../../services/words.service';
import {ErrorService} from '../../services/error.service';

@Component({
  selector: 'card-item',
  template: `
    <div class="card center-block"
      [@cardState]="state">
      <add-to-list [word]="card"></add-to-list>

<!-- Question -->
      <div 
        *ngIf="isQuestion"
        (click)="turnCard()"
        class="question text-center">
        <div class="wordwrapper center-block">
          <h2 class="word">
            <span genusColor
            [genus]="cardData.genus" 
            [tpe]="card.tpe">
              {{cardData.word}}
            </span>
          </h2>
        </div>
        <em 
          getFilterValue 
          [value]="card.tpe" 
          [tpe]="'tpes'">
        </em>
        <div class="text-info" *ngIf="cardData.hint">hint: {{cardData.hint}}</div>
      </div>

<!-- Answer -->
      <div *ngIf="!isQuestion" class="answer">
        <card-answer 
          [cardData]="cardData"
          [tpe]="card.tpe"
          [showPronoun]="settings.showPronoun">
        </card-answer>

<!-- Perfective aspect -->
        <div class="clearfix" *ngIf="this.cardDataPf">
          <card-answer 
            [cardData]="cardDataPf"
            [tpe]="card.tpe"
            [showPronoun]="false">
          </card-answer>
        </div>

<!-- Buttons -->
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
    </div>
    `,
  styleUrls: ['client/components/cards/card.component.css'],
  animations: [
    trigger('cardState', [
      transition('question => answer', animate(300, keyframes([
        style({color:'#fff', transform: 'scaleX(0)'}),
        style({transform: 'scaleX(1)'})
      ]))),
      transition('answer => question', animate(500, keyframes([
        style({borderColor: '#999', color: '#ddd', transform: 'rotate(300deg)'}),
        style({borderColor: '#fff', color: '#fff', transform: 'translateX(400%)'})
      ])))
    ])
  ]
})

export class CardItem implements OnChanges {
  @Input() card: WordPair;
  @Input() settings: AllSettings;
  @Output() cardAnswered = new EventEmitter();
  isQuestion = true;
  cardData: Word;
  cardDataPf: Word;
  state = 'question';
  showAnswer = false;

  constructor(
    private wordService: WordService,
    private errorService: ErrorService
  ) {}

  ngOnChanges() {
    this.getCardData();
  }

  turnCard() {
    this.isQuestion = !this.isQuestion;
    this.state = this.isQuestion ? 'question' : 'answer';
    this.getCardData();
  }

  answerCard(correct: boolean) {
    this.cardAnswered.emit(correct);
    this.turnCard();
    this.wordService.saveAnswer('demoUser', this.card._id, this.card.answer._id, correct).subscribe(
        answer => {;},
        error => this.errorService.handleError(error)
      );
  }

  getCardData() {
    if (this.isQuestion) {
      this.cardData = this.settings.lanDir === 'cznl' ? this.card.cz : this.card.nl;
    } else {
      this.cardDataPf = null;
      if (this.settings.lanDir === 'cznl') {
        this.cardData = this.card.nl;
      } else {
        this.cardData = this.card.cz;
        if(this.card.tpe === 'verb') {
          this.cardData.aspect = 'impf';
          this.cardDataPf = this.card.czP;
          if (this.cardDataPf) {
            this.cardDataPf.aspect = 'pf';
          }
        }
      }
    }
  }
}
