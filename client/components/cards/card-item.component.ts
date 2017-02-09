import {Component, Input, Output, EventEmitter, OnChanges, OnDestroy,
  trigger, style, transition, animate, keyframes} from '@angular/core';
import {WordPair, Word, Total} from '../../models/word.model';
import {AllSettings} from '../../models/settings.model';
import {WordService} from '../../services/words.service';
import {ErrorService} from '../../services/error.service';
import 'rxjs/add/operator/takeWhile';

@Component({
  selector: 'card-item',
  template: `
    <div class="card center-block"
      [@cardState]="state" (click)="turnCard(false)">
      <add-to-list [word]="card"></add-to-list>

<!-- Question -->

      <div *ngIf="isQuestion" class="question text-center">
        <card-question 
          [cardData]="cardData"
          [tpe]="card.tpe"
          [isPerfective]="card.perfective">
        </card-question>
      </div>  

<!-- Answer -->
      <div *ngIf="!isQuestion" class="answer">
        <card-answer 
          [cardData]="cardData"
          [tpe]="card.tpe"
          [showPronoun]="settings.showPronoun">
        </card-answer>

<!-- Perfective aspect -->
        <div class="clearfix" *ngIf="this.cardDataPf && !card.perfective">
          <card-answer 
            [cardData]="cardDataPf"
            [tpe]="card.tpe"
            [showPronoun]="false">
          </card-answer>
        </div>

<!-- Answer Buttons -->
      <div class="clearfix">
        <div 
          class="btn btn-success btn-sm pull-right" 
          (click)="answerCard($event, true)">
          Juist
        </div>
        <div 
          class="btn btn-danger btn-sm pull-left" 
          (click)="answerCard($event, false)">
          Fout
        </div>
      </div>
    </div>

<!-- Scorebar -->
    <div class="scorebarwrapper" 
      [ngStyle]="{width:total.correct + total.incorrect > 134 ? '270px' : (total.correct + total.incorrect) * 2 + 2 + 'px'}">
      <score-bar [total]="total"></score-bar>
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

export class CardItem implements OnChanges, OnDestroy {
  @Input() card: WordPair;
  @Input() settings: AllSettings;
  @Input() test: string;
  @Output() cardAnswered = new EventEmitter();
  isQuestion: boolean = true;
  cardData: Word;
  cardDataPf: Word;
  total: Total;
  state: string = 'question';
  showAnswer: boolean = false;
  componentActive: boolean = true;

  constructor(
    private wordService: WordService,
    private errorService: ErrorService
  ) {}

  ngOnChanges() {
    this.getCardData();
  }

  turnCard(answered: boolean) {
    if (this.isQuestion || answered) {
      this.isQuestion = !this.isQuestion;
      this.state = this.isQuestion ? 'question' : 'answer';
      this.getCardData();
    }
  }

  answerCard(event: MouseEvent, correct: boolean) {
    event.stopPropagation();
    this.wordService
    .saveAnswer(this.card._id, correct)
    .takeWhile(() => this.componentActive)
    .subscribe(
      answer => {
        console.log('answer', answer);
        this.cardAnswered.emit(correct);
        this.updateTotals(correct, answer.upserted);
        this.turnCard(true);
      },
      error => this.errorService.handleError(error)
    );
  }

  getCardData() {
    if (this.isQuestion) {
      this.cardData = this.settings.lanDir === 'cznl' ? this.card.cz : this.card.nl;
      this.cardDataPf = this.settings.lanDir === 'nlcz' && this.card.tpe === 'verb' ? this.card.nlP : null;
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

    this.total = this.card.answer && this.card.answer.total ? {
      correct: this.card.answer.total.correct ? this.card.answer.total.correct : 0,
      incorrect: this.card.answer.total.incorrect ? this.card.answer.total.incorrect : 0
    } : {
      correct:0,
      incorrect:0
    };
  }

  updateTotals(correct: boolean, upserted: Array<Object>) {
    if (!this.card.answer.total) {
      this.card.answer.total = {
        correct: 0,
        incorrect: 0
      };
    }
    if (correct) {
      this.card.answer.total.correct++;
    } else {
      this.card.answer.total.incorrect++;
    }
    if (upserted) {
      this.card.answer.review = false;
    } else {
      this.card.answer.review = true;
    }
  }

  ngOnDestroy() {
    event.stopPropagation();
    this.componentActive = false;
  }
}
