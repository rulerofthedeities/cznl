import {Component, Input, Output, OnInit, EventEmitter} from '@angular/core';
import {WordPair, Word} from '../models/word.model';
import {AllSettings} from '../models/settings.model';
import {RestartService} from '../services/restart.service';
import {SettingsService} from '../services/settings.service';
import {ErrorService} from '../services/error.service';

@Component({
  selector: 'review',
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
  translationPf: Word = null;
  ready = false;
  settings: AllSettings;

  constructor (
    private restartService: RestartService,
    private settingsService: SettingsService,
    private errorService: ErrorService
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
      },
      error => this.errorService.handleError(error)
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
    let word = this.words[i];
    let tgtword = this.settings.lanDir === 'cznl' ? word.nl : word.cz;
    this.selected = i;
    this.translation.word = tgtword.word;
    this.translation.genus = this.settings.lanDir === 'cznl' ? '' : tgtword.genus;
    this.translation.case = tgtword.case;
    this.translation.aspect = word.tpe === 'verb' ? (word.perfective ? 'pf' : 'impf') : '';
    this.translation.firstpersonsingular = word.tpe === 'verb' ? tgtword.firstpersonsingular : '';
    if (this.settings.showPronoun) {
      this.translation.article = tgtword.article;
    }
    this.translationPf = null;
    if (word.tpe==='verb' && this.settings.lanDir === 'nlcz') {
      //Show perfective for this verb
      tgtword = this.words[i].czP;
      if (tgtword) {
        this.translationPf = {word:'', article:'',genus:''};
        this.translationPf.word = tgtword.word;
        this.translationPf.case = tgtword.case;
        this.translationPf.firstpersonsingular = tgtword.firstpersonsingular;
        this.translationPf.aspect = 'pf';
      }
    }
  }
}
