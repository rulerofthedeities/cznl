import {Component, OnInit} from '@angular/core';
import {WordlistService} from '../../services/wordlists.service';
import {WordList} from '../../models/list.model';

@Component({
  selector: 'word-lists',
  providers: [WordlistService],
  template: `
    <ul class="list-group" *ngIf="ready">
      <li 
        *ngFor="let list of lists; let i = index;"
        (click)="selectList(i)"
        [ngClass]="{'active':list==selectedList}"
        class="list-group-item">
          {{list.name}}
        <span class="badge">{{list.count}}</span>
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
      [disabled]="!wordsInList || wordsInList < 1"
      (click)="start('review', level.value, wordtpe.value, cats.value)">
    <span class="fa fa-play"></span>
      Toon Overzicht
    </button>`
})

export class WordLists implements OnInit {
  lists: WordList[];
  ready = false;
  selectedList: WordList;
  wordsInList = 0;

  constructor(private wordlistService: WordlistService) {}

  ngOnInit() {
    this.wordlistService.getWordLists()
      .then(lists => {
        this.lists = lists;
        this.ready = true;
      });
  }

  selectList(i: number) {
    this.selectedList = this.lists[i];
    this.wordsInList = this.selectedList.count;
  }

}
