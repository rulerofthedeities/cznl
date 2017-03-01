import {Component, Input, ViewChild, OnChanges, OnDestroy} from '@angular/core';
import {ShowListsComponent} from './show-lists.component';
import {WordPair} from '../../models/word.model';
import {WordList} from '../../models/list.model';
import {WordlistService} from '../../services/wordlists.service';
import {ErrorService} from '../../services/error.service';
import 'rxjs/add/operator/takeWhile';

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
  styleUrls: ['./word-list.css']
})

export class AddToListComponent implements OnChanges, OnDestroy {
  @Input() word: WordPair;
  @ViewChild(ShowListsComponent) lists: ShowListsComponent;
  isInList = false;
  componentActive = true;

  constructor(
    private wordlistService: WordlistService,
    private errorService: ErrorService
  ) {}

  ngOnChanges() {
    this.wordlistService
    .getWordLists('user')
    .takeWhile(() => this.componentActive)
    .subscribe(
      lists => {
        this.isInList = this._checkIfInUserlist(lists);
      },
      error => this.errorService.handleError(error)
    );
  }

  showModalLists() {
    event.stopPropagation();
    this.lists.updateUserLists(this.word);
  }

  onListUpdated(update: any) {
    let isInList = false;
    this.lists.isWordInList.forEach(inList => {
      if (inList) { isInList = true; }
    });
    this.isInList = isInList;
  }

  ngOnDestroy() {
    this.componentActive = false;
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
