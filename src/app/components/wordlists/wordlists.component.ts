import {Component, OnInit, OnDestroy, Input, Output, EventEmitter} from '@angular/core';
import {WordlistService} from '../../services/wordlists.service';
import {ErrorService} from '../../services/error.service';
import {WordList} from '../../models/list.model';
import 'rxjs/add/operator/takeWhile';

@Component({
  selector: 'word-lists',
  templateUrl: 'wordlists.component.html',
  styles: [`li {cursor:default;}`]
})

export class WordListsComponent implements OnInit, OnDestroy {
  @Input('created') tpe;
  @Output() selectedUserList = new EventEmitter<Object>();
  lists: WordList[];
  ready = false;
  selected: WordList;
  wordsInList = 0;
  componentActive = true;

  constructor(
    private wordlistService: WordlistService,
    private errorService: ErrorService
  ) {}

  ngOnInit() {
    this.wordlistService
    .getWordLists(this.tpe)
    .takeWhile(() => this.componentActive)
    .subscribe(
      lists => {
        this.lists = lists;
        this.ready = true;
      },
      error => this.errorService.handleError(error)
    );
  }

  selectList(i: number) {
    this.selected = this.lists[i];
    this.wordsInList = this.selected.count;
  }

  start(exerciseTpe: string) {
    this.selectedUserList.emit({
      selected: this.selected,
      exerciseTpe: exerciseTpe,
      listTpe: this.tpe
    });
  }

  ngOnDestroy() {
    this.componentActive =  false;
  }
}
