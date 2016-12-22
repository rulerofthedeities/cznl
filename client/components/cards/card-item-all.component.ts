import {Component, Input, Output, EventEmitter,
  trigger, style, transition, animate, keyframes} from '@angular/core';
import {WordPair} from '../../models/word.model';
import {AllSettings} from '../../models/settings.model';
import {WordService} from '../../services/words.service';
import {ErrorService} from '../../services/error.service';

@Component({
  selector: 'card-item-all',
  template: `
  <div class="card center-block"
    [@cardState]="state" (click)="turnCard()">
    <add-to-list [word]="card"></add-to-list>

<!-- Question -->

    <div class="question text-center">
      <card-question 
        [cardData]="getQuestionData()"
        [tpe]="card.tpe"
        [isPerfective]="card.perfective">
      </card-question>
    </div>

<!-- Answer -->

    <div class="answer" *ngIf="iseven">
      <card-answer
        [cardData]="getAnswerData(false)"
        [tpe]="card.tpe"
        [showPronoun]="settings.showPronoun">
      </card-answer>
    </div>
    <div class="answer" *ngIf="!iseven">
      <card-answer 
        [cardData]="getAnswerData(false)"
        [tpe]="card.tpe"
        [showPronoun]="settings.showPronoun">
      </card-answer>
    </div>

<!-- Perfective aspect -->

    <div class="clearfix" *ngIf="this.cardDataPf && !card.perfective">
      <card-answer 
        [cardData]="getAnswerData(true)"
        [tpe]="card.tpe"
        [showPronoun]="false">
      </card-answer>
    </div>
<!-- Buttons -->
    
    <button class="btn btn-success" (click)="goBack()"><span class="fa fa-chevron-left"></span>Back</button>

  </div>

  `,
  styleUrls: ['client/components/cards/card.component.css'],
  styles: [`
    .card {cursor:pointer;min-height:300px;position:relative;}
    .btn {position: absolute;bottom:6px;}
  `],
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

export class CardItemAll {
  @Input() card: WordPair;
  @Input() settings: AllSettings;
  @Input() test: string;
  @Output() cardTurned = new EventEmitter<number>();
  iseven: boolean = true;

  constructor(
    private wordService: WordService,
    private errorService: ErrorService
  ) {}

  turnCard() {
    event.stopPropagation();
    this.cardTurned.emit(1);
    this.iseven = !this.iseven;
  }

  goBack() {
    event.stopPropagation();
    this.cardTurned.emit(-1);
    this.iseven = !this.iseven;
  }

  getQuestionData() {
    return this.settings.lanDir === 'cznl' ? this.card.cz : this.card.nl;
  }

  getAnswerData(perfective: boolean) {
    if (perfective) {
      if (this.settings.lanDir === 'cznl') {
          return this.card.czP;
      }
    } else {
      return this.settings.lanDir === 'cznl' ? this.card.nl : this.card.cz;
    }
  }
}
