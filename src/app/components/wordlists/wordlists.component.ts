import {Component, OnInit, OnDestroy, Input, Output, EventEmitter} from '@angular/core';
import {WordlistService} from '../../services/wordlists.service';
import {ErrorService} from '../../services/error.service';
import {WordList} from '../../models/list.model';
import 'rxjs/add/operator/takeWhile';

@Component({
  selector: 'word-lists',
  template: `
    <div *ngIf="ready && lists.length < 1">
      Geen {{tpe==="user" ? "persoonlijke" : ""}} woordenlijst gevonden.
    </div>
    <div *ngIf="ready && lists.length < 1 && tpe==='user'">
      Klik op een ster bij een woord om een woordenlijst aan te maken.
    </div>
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
      (click)="start('test')"
      [disabled]="!wordsInList || wordsInList < 1">
      <span class="fa fa-play"></span>
      Start Test
    </button>
    <button 
      class="btn btn-success btn-lg" 
      (click)="start('review')"
      [disabled]="!wordsInList || wordsInList < 1">
    <span class="fa fa-play"></span>
      Toon Overzicht
    </button>`,
  styles: [`
    li {cursor:default;}
    `]
})

export class WordLists implements OnInit, OnDestroy {
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
