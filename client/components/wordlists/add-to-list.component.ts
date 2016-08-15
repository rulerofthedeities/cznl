import {Component, Input, ViewChild} from '@angular/core';
import {ShowLists} from './show-lists.component';
import {WordPair} from '../../models/word.model';

@Component({
  selector: 'add-to-list',
  template: `
    <div 
      class="fa pull-right"
      [ngClass]="{
        'fa-star':hasLists(word),
        'fa-star-o':!hasLists(word)
      }"
      (click)="showModalLists()">
    </div>
    <show-lists></show-lists>
  `,
  styleUrls:['client/components/wordlists/word-list.css']
})

export class AddToList {
  @Input() word: WordPair;
  @ViewChild(ShowLists) lists: ShowLists;

  showModalLists() {
    this.lists.updateUserLists(this.word);
  }

  hasLists(word: WordPair) {
    if (this.word.answer && this.word.answer.listIds) {
      return this.word.answer.listIds.length > 0;
    } else {
      return false;
    }
  }
}
