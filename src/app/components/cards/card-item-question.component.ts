import {Component, Input} from '@angular/core';
import {Word} from '../../models/word.model';

@Component({
  selector: 'card-question',
  templateUrl: 'card-item-question.component.html',
  styleUrls: ['./card.component.css']
})

export class CardItemQuestionComponent {
  @Input() cardData: Word;
  @Input() cardDataPf: Word;
  @Input() tpe: string;
}
