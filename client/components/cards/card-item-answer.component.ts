import {Component, Input} from '@angular/core';
import {Word} from '../../models/word.model';

@Component({
  selector: 'card-answer',
  template: `
      <div class="wordwrapper center-block">
        <div class="word" *ngIf="showPronoun">{{cardData.article}}
        </div>
        <h2 class="word">
          <span 
            genusColor
            [genus]="cardData.genus" 
            [tpe]="tpe">
            {{cardData.word}}
          </span>
          <span class="case" *ngIf="cardData.case">
            +<span 
              getFilterValue
              [value]="cardData.case"
              [tpe]="'cases'">
            </span>
          </span>
          <span class="subword" *ngIf="(cardData.aspect)">
          ({{cardData.aspect}})
          </span>
        </h2>
      </div>
      <div class="clearfix left">
        <div *ngIf="cardData.otherwords"><span class="text-muted">ook:</span> <span class="text-info">{{cardData.otherwords}}</span></div>
        <div *ngIf="cardData.plural"><span class="text-muted">meervoud:</span> <span class="text-primary">{{cardData.plural}}</span></div>
        <div *ngIf="cardData.firstpersonsingular">
          <span class="text-muted">1e p.:</span> <span class="text-primary">{{cardData.firstpersonsingular}}</span>
        </div>
        <div *ngIf="cardData.info"><span class="text-muted">info:</span> <span class="text-primary">{{cardData.info}}</span></div>
      </div>
        `,
  styleUrls: ['client/components/cards/card.component.css']
})

export class CardItemAnswer {
  @Input() cardData: Word;
  @Input() tpe: string;
  @Input() showPronoun: boolean;
}
