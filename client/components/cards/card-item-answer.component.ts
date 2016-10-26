import {Component, Input} from '@angular/core';
import {Word, Total} from '../../models/word.model';

@Component({
  selector: 'card-answer',
  template: `<div class="wordwrapper left">
          <div class="word" *ngIf="showPronoun">{{cardData.article}}</div>
          <h2 class="word">
            <span genusColor
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
          <div class="text-info">{{cardData.alt}}</div>
          <div *ngIf="cardData.plural">meervoud: <span class="text-primary">{{cardData.plural}}</span></div>
          <div *ngIf="cardData.firstpersonsingular">1e p.: <span class="text-primary">{{cardData.firstpersonsingular}}</span></div>
          <div *ngIf="cardData.info">info: <span class="text-primary">{{cardData.info}}</span></div>
        </div>
        `,
  styleUrls: ['client/components/cards/card.component.css']
})

export class CardItemAnswer {
  @Input() cardData: Word;
  @Input() tpe: string;
  @Input() showPronoun: boolean;
}
