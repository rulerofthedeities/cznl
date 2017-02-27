import {Component, Input} from '@angular/core';
import {Word} from '../../models/word.model';

@Component({
  selector: 'card-answer',
  templateUrl: 'card-item-answer.component.html',
  styleUrls: ['./card.component.css']
})

export class CardItemAnswerComponent {
  @Input() cardData: Word;
  @Input() tpe: string;
  @Input() showPronoun: boolean;
}
