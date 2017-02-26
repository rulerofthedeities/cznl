import {Component, Input} from '@angular/core';
import {Word} from '../../models/word.model';

@Component({
  selector: 'card-question',
  template: `
    <div class="wordwrapper center-block">
      <h2 class="word">
        <span>
          {{cardData.word}}
        </span>
      </h2>
    </div>
    <em 
      getFilterValue 
      [value]="tpe" 
      [tpe]="'tpes'">
    </em>
    <div class="margin"></div>
    <div class="text-primary" *ngIf="cardData.otherwords"><span class="text-muted">ook:</span> {{cardData.otherwords}}</div>
    <div class="text-primary" *ngIf="cardData.hint"><span class="text-muted">hint:</span> {{cardData.hint}}</div>
    <div class="text-primary" *ngIf="cardData.info">({{cardData.info}})</div>
    `,
  styleUrls: ['./card.component.css']
})

export class CardItemQuestionComponent {
  @Input() cardData: Word;
  @Input() cardDataPf: Word;
  @Input() tpe: string;
}
