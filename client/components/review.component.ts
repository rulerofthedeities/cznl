import {Component, Input, Output, OnInit, EventEmitter} from '@angular/core';
import {AddToList} from './wordlists/add-to-list.component';
import {GetFilterValue} from '../directives/get-filter-value.directive';
import {WordPair} from '../models/word.model';
import {AllSettings} from '../models/settings.model';
import {RestartService} from '../services/restart.service';
import {SettingsService} from '../services/settings.service';

@Component({
  selector: 'review',
  directives: [AddToList, GetFilterValue],
  template: `
  <div class="review-list row" *ngIf="ready">
    <div class="col-sm-7">
      <ul class="list-group">
        <li 
          *ngFor="let word of words;let i = index;"
          class="list-group-item"
          (mouseover)="onSelected(i)"
          [ngClass]="{active:selected == i}">
          <div class="pull-left no">
            <span
              class="fa pull-left" 
              style="margin-top:3px;"
              [ngClass]="{
                'fa-check':word.answer.correct===true,
                'fa-times':word.answer.correct===false,
                'fa-circle-o':isUndefined(word.answer.correct)}"
              [ngStyle]="{'color': getColor(word.answer.correct)}">
            </span>
            <span>{{i + 1}}.</span>
          </div>
          <div class="pull-left">
              <div class="word">
                <span class="genus" *ngIf="word.cz.article && settings.lanDir=='cznl' && settings.showPronoun">
                  {{word.cz.article}}
                </span>
                {{settings.lanDir=="cznl" ? word.cz.word : word.nl.word}}
                <span class="genus" *ngIf="word.cz.genus && settings.lanDir=='cznl'">
                  ({{word.cz.genus}})
                </span>
              </div>
              <div class="pull-left small">
                <em 
                  getFilterValue 
                  [value]="word.tpe" 
                  [tpe]="'tpes'">
                </em>
              </div>
          </div>
          <add-to-list [word]="word"></add-to-list>
          <div class="clearfix"></div>
        </li>
      </ul> 
    </div>  

    <div class="col-sm-5">
      <ul class="list-group text-center translation">
        <li 
          *ngFor="let word of words;let i = index;"
          class="list-group-item">
          <div *ngIf="selected===i" class="word text-center">
            <span class="genus" *ngIf="translation.article">
              {{translation.article}}
            </span>
            {{translation.word}}
            <span class="genus" *ngIf="translation.genus && settings.lanDir=='nlcz'">
              ({{translation.genus}})
            </span>
            <span class="case" *ngIf="translation.case && settings.lanDir=='nlcz'">
              +<span 
                getFilterValue
                [value]="translation.case"
                [tpe]="'cases'">
              </span>
            </span>
          </div>
        </li>
      </ul>

    </div>
  </div>
  <div class="clearfix"></div>
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
  .word {font-size:28px;}
  .translation .word {font-size:36px;}
  .genus {font-size:14px;}
  li{height:80px;}
  .translation .list-group-item{border:0;}
  li .fa {width: 40px;}
  .btn .fa {margin-right:3px;}
  .no {
    font-size:20px;margin-top:8px;margin-right:10px;}
  `]
})

export class Review implements OnInit {
  @Input() words: WordPair[];
  @Output() restart = new EventEmitter();
  selected: number;
  translation = {word:'', genus:'', case:'', article:''};
  ready = false;
  settings: AllSettings;

  constructor (
    private restartService: RestartService,
    private settingsService: SettingsService
  ) {}

  ngOnInit() {
    this.words.forEach(word => {
      if (!word.answer) {
        word.answer = {_id: null};
    }});
    this.settingsService.getAppSettings().then(
      settings => {
        this.settings = settings.all;
        this.ready = true;
      }
    );
  }

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
    let word = this.settings.lanDir === 'cznl' ? this.words[i].nl : this.words[i].cz;
    this.selected = i;
    this.translation.word = word.word;
    this.translation.genus = word.genus;
    this.translation.case = word.case;
    if (this.settings.showPronoun) {
      this.translation.article = word.article;
    }
  }
}