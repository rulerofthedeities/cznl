import {Component, Input, ViewChild, OnChanges} from '@angular/core';
import {ShowLists} from './show-lists.component';
import {WordPair} from '../../models/word.model';
import {WordList} from '../../models/list.model';
import {WordlistService} from '../../services/wordlists.service';
import {ErrorService} from '../../services/error.service';

@Component({
  selector: 'add-to-list',
  template: `
    <div 
      class="fa pull-right"
      [ngClass]="{
        'fa-star':isInList,
        'fa-star-o':!isInList
      }"
      (click)="showModalLists()">
    </div>
    <show-lists [word]="word" (userlistChanged)="onListUpdated($event)"></show-lists>
  `,
  styleUrls:['client/components/wordlists/word-list.css']
})

export class AddToList implements OnChanges {
  @Input() word: WordPair;
  @ViewChild(ShowLists) lists: ShowLists;
  isInList = false;

  constructor(
    private wordlistService: WordlistService,
    private errorService: ErrorService
  ) {}

  ngOnChanges() {
    this.wordlistService.getWordLists('user').subscribe(
      lists => {
        this.isInList = this._checkIfInUserlist(lists);
      },
      error => this.errorService.handleError(error)
    );
  }

  showModalLists() {
    this.lists.updateUserLists(this.word);
  }

  onListUpdated(update: any) {
    let isInList = false;
    this.lists.isWordInList.forEach(inList => {
      if (inList) {isInList = true;}
    });
    this.isInList = isInList;
  }

  private _checkIfInUserlist(lists: WordList[]): boolean {
    let list: string[];
    if (lists) {
      for (let i = 0; i < lists.length; i++) {
        if (lists[i].wordIds) {
          list = lists[i].wordIds.filter(id => this.word._id === id);
          if (list.length > 0) {
            return true;
          }
        }
      }
    }
    return false;
  }
}
