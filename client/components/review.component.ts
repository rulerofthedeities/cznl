import {Component, Input, Output, OnInit, EventEmitter} from '@angular/core';
import {AddToList} from './wordlists/add-to-list.component';
import {GetFilterValue} from '../directives/get-filter-value.directive';
import {WordPair, Word} from '../models/word.model';
import {AllSettings} from '../models/settings.model';
import {RestartService} from '../services/restart.service';
import {SettingsService} from '../services/settings.service';

@Component({
  selector: 'review',
  directives: [AddToList, GetFilterValue],
  templateUrl: '/client/components/review.component.html',
  styles:[`
  .buttons {max-width: 240px;}
  .word {font-size:28px;}
  .translation .word {font-size:36px;}
  .genus,.subword {font-size:14px;}
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
  translation: Word = {word:'', article:'',genus:''};
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
    return (typeof correct === 'undefined');
  }

  getColor(correct: boolean) : string {
    if (this.isUndefined(correct)) {
      return 'grey';
    } else {
      return correct ? 'green' : 'red';
    }
  }

  onSelected(i: number) {
    //console.log('all', this.words[i]);
    //console.log('nl', this.words[i].nl);
    //console.log('cz', this.words[i].cz);
    let word = this.words[i];
    let tgtword = this.settings.lanDir === 'cznl' ? word.nl : word.cz;
    this.selected = i;
    this.translation.word = tgtword.word;
    this.translation.genus = tgtword.genus;
    this.translation.case = tgtword.case;
    this.translation.aspect = word.tpe === 'verb' ? 'impf' : '';
    this.translation.firstpersonsingular = word.tpe === 'verb' ? tgtword.firstpersonsingular : '';
    if (this.settings.showPronoun) {
      this.translation.article = tgtword.article;
    }
  }
}
