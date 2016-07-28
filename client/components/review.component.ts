import {Component, Input, Output, EventEmitter} from '@angular/core';
import {WordPair} from '../model/word.model';
import {RestartService} from '../services/restart.service';

@Component({
  selector: 'review',
  template: `
  <div class="center-block review-list">
    <ul class="list-group text-center">
      <li 
        *ngFor="let word of words;let i = index;"
        class="list-group-item"
        (mouseover)="onSelected(i)"
        [ngClass]="{active:selected == i}">
        <span 
          class="fa pull-left" 
          [ngClass]="{'fa-check': word.correct===true,'fa-times':word.correct===false,'fa-circle-o':isUndefined(word.correct)}"
          [ngStyle]="{'color': getColor(word.correct)}"></span>
        <span class="pull-left">{{i + 1}}.</span>
        <div>{{word.cz.word}} ({{word.cz.genus}}) => {{word.nl.word}}</div>
        <div>{{word.tpe}}</div>
      </li>
    </ul>
    </div>
    <div class="buttons center-block">
      <button 
        class="btn btn-success btn-lg btn-block"
        (click)="doRestart()">
        <span class="fa fa-play"></span>
        Test deze lijst
      </button>
      <button 
        class="btn btn-success btn-lg btn-block"
        (click)="doNewTest()">
        <span class="fa fa-file-o"></span>
        Nieuwe test
      </button>
    </div>
  `,
  styles:[`
  .buttons {max-width: 240px;}
  .review-list {max-width: 500px;}
  li {font-size: 20px;}
  li .fa {width: 40px;}
  .btn .fa {margin-right:3px;}
  `]
})

export class Review {
  @Input() words: WordPair[];
  @Output() restart = new EventEmitter();
  selected: number;

  constructor (private restartService: RestartService) {}

  doRestart() {
    this.restart.emit(true);
  }

  doNewTest() {
    this.restartService.restartTest();
  }

  isUndefined(correct: boolean): boolean {
    if (typeof correct === 'undefined') {
      return true;
    } else {
      return false;
    }
  }

  getColor(correct: boolean) : string {
    if (this.isUndefined(correct)) {
      return 'grey';
    } else {
      return correct ? 'green' : 'red';
    }
  }

  onSelected(i: number) {
    this.selected = i;
  }
}
