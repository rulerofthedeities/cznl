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
          [ngClass]="{'fa-check':word.correct,'fa-times':!word.correct}"
          [ngStyle]="{'color':word.correct?'green':'red'}"></span>
        <span class="pull-left">{{i + 1}}.</span>
        <div>{{word.cz.word}} ({{word.cz.genus}}) => {{word.nl.word}}</div>
        <div>{{word.tpe}}</div>
      </li>
    </ul>
    </div>
    <div class="buttons center-block">
      <button 
        class="btn btn-success btn-block"
        (click)="doRestart()">
        Test deze lijst
      </button>
      <button 
        class="btn btn-success btn-block"
        (click)="doNewTest()">
        Nieuwe test
      </button>
    </div>
  `,
  styles:[`
  .buttons {max-width: 240px;}
  .review-list {max-width: 500px;}
  li {font-size: 20px;}
  .fa {width: 40px;}
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

  onSelected(i: number) {
    this.selected = i;
  }
}
