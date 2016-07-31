import {Component, Input} from '@angular/core';
import {WordPair} from '../../models/word.model';

@Component({
  selector: 'add-to-list',
  template: `
    <div 
      class="fa pull-right"
      [ngClass]="{'fa-star':word.answer.listIds}">
    </div>
  `,
  styles:[`
    .fa {
      color:gold;
      font-size:24px;
      text-shadow: 1px 1px grey;}
  `]
})

export class AddToList {
  @Input() word: WordPair;

}
