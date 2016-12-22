import {Component, Input, Output, OnInit, EventEmitter, OnChanges,
  trigger, style, transition, animate, keyframes} from '@angular/core';
import {WordPair, Word, Total, Direction} from '../../models/word.model';
import {AllSettings} from '../../models/settings.model';
import {WordService} from '../../services/words.service';
import {ErrorService} from '../../services/error.service';


@Component({
  selector: 'card-item',
  template: `
    <div class="card center-block"
      *ngIf="cardDataLoaded"
      [@cardState]="state" (click)="turnCard(false)">
      <add-to-list [word]="card"></add-to-list>

<!-- Question -->

      <div *ngIf="isQuestion" class="question text-center">
        <card-question 
          [cardData]="cardData.q"
          [tpe]="card.tpe"
          [isPerfective]="card.perfective">
        </card-question>
      </div>  

<!-- Answer -->
Is test:{{isTest}}
      <div *ngIf="!isQuestion || !isTest" class="answer">
        answer
        <card-answer 
          [cardData]="cardData.a"
          [tpe]="card.tpe"
          [showPronoun]="settings.showPronoun">
        </card-answer>
    tpe1:{{card.tpe}}

<!-- Perfective aspect -->
        <div class="clearfix" *ngIf="this.cardDataPf.a && !card.perfective">
          <card-answer 
            [cardData]="cardDataPf.a"
            [tpe]="card.tpe"
            [showPronoun]="false">
          </card-answer>
        </div>

<!-- Answer Buttons -->
      <div class="clearfix" *ngIf="isTest">
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

export class CardItem implements OnChanges, OnInit {
  @Input() card: WordPair;
  @Input() settings: AllSettings;
  @Input() test: string;
  @Input() exerciseTpe: string;
  @Output() cardAnswered = new EventEmitter();
  @Output() cardNavigated = new EventEmitter();
  isQuestion = true;
  isTest = true;
  cardData: {q:Word,a:Word};
  cardDataPf: {q:Word,a:Word};
  total: Total;
  state = 'question';
  showAnswer = false;
  cardDataLoaded = false;

  constructor(
    private wordService: WordService,
    private errorService: ErrorService
  ) {}

  ngOnChanges() {
    this.cardDataLoaded = false;
    this.getCardData();
  }

  ngOnInit() {
    if (this.exerciseTpe === 'practise') {
      this.isTest = false;
    }
  }

  turnCard(answered: boolean) {
    console.log('turn?');
    if (this.isQuestion || answered) {
      console.log('turn card', answered);
      if (this.isTest) {
        this.isQuestion = !this.isQuestion;
        this.state = this.isQuestion ? 'question' : 'answer';
      } else {
        this.navigateCard(Direction.Right);
      }
    }
  }

  answerCard(event: MouseEvent, correct: boolean) {
    event.stopPropagation();
    this.cardAnswered.emit(correct);
    this.updateTotals(correct);
    this.turnCard(true);
    this.wordService.saveAnswer(this.card._id, correct).subscribe(
        answer => {;},
        error => this.errorService.handleError(error)
      );
  }

  navigateCard(direction: Direction) {
    this.cardNavigated.emit(direction);
  }

  getCardData() {
    console.log('card data1');
    this.cardData = {q:null,a:null};
    this.cardDataPf = {q:null,a:null};
    console.log('card data2', this.cardData);
    //Question
    this.cardData.q = this.settings.lanDir === 'cznl' ? this.card.cz : this.card.nl;
    this.cardDataPf.q = this.settings.lanDir === 'nlcz' && this.card.tpe === 'verb' ? this.card.nlP : null;
    console.log('card data3', this.cardData);

    //Answer
    if (this.settings.lanDir === 'cznl') {
      this.cardData.a = this.card.nl;
    } else {
      this.cardData.a = this.card.cz;
      console.log('card data3b', this.cardData);
      if(this.card.tpe === 'verb' && this.cardData.a) {
        this.cardData.a.aspect = 'impf';
        this.cardDataPf.a = this.card.czP;
        this.cardDataPf.a.aspect = 'pf';
      }
    }

    console.log('cardData4', this.cardData, this.cardDataPf, this.card.tpe);

    this.total = this.card.answer && this.card.answer.total ? {
      correct: this.card.answer.total.correct ? this.card.answer.total.correct : 0,
      incorrect: this.card.answer.total.incorrect ? this.card.answer.total.incorrect : 0
    } : {
      correct:0,
      incorrect:0
    };

    this.cardDataLoaded = true;
  }

  updateTotals(correct: boolean) {
    if (!this.card.answer.total) {
      this.card.answer.total = {correct:0, incorrect:0};
    }
    if (correct) {
      this.card.answer.total.correct++;
    } else {
      this.card.answer.total.incorrect++;
    }
  }
}
