import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {WordlistService} from '../../services/wordlists.service';
import {WordList} from '../../models/list.model';

@Component({
  selector: 'word-lists',
  template: `
    <ul class="list-group" *ngIf="ready">
      <li 
        *ngFor="let list of lists; let i = index;"
        (click)="selectList(i)"
        [ngClass]="{'active':list==selected}"
        class="list-group-item">
          {{list.name}}
        <span class="badge" *ngIf="list.count>0">{{list.count}}</span>
      </li>
    </ul>
    <button
      class="btn btn-success btn-lg"
      [disabled]="!wordsInList || wordsInList < 1">
      <span class="fa fa-play"></span>
      Start Test
    </button>
    <button 
      class="btn btn-success btn-lg" 
      (click)="start()"
      [disabled]="!wordsInList || wordsInList < 1">
    <span class="fa fa-play"></span>
      Toon Overzicht
    </button>`,
  styles:[`
    li {cursor:default;}
    `]
})

export class WordLists implements OnInit {
  @Input('created') tpe;
  @Output() selectedList = new EventEmitter<string>();
  lists: WordList[];
  ready = false;
  selected: WordList;
  wordsInList = 0;

  constructor(private wordlistService: WordlistService) {}

  ngOnInit() {
    this.wordlistService.getWordLists(this.tpe)
      .then(lists => {
        this.lists = lists;
        this.ready = true;
      });
  }

  selectList(i: number) {
    this.selected = this.lists[i];
    this.wordsInList = this.selected.count;
  }

  start() {
    this.selectedList.emit(this.selected._id);
  }

}
