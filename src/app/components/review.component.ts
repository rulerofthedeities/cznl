import {Component, Input, OnInit} from '@angular/core';
import {WordPair, Word} from '../models/word.model';
import {AllSettings} from '../models/settings.model';
import {SettingsService} from '../services/settings.service';
import {ErrorService} from '../services/error.service';
import 'rxjs/add/operator/takeWhile';

@Component({
  selector: 'review',
  templateUrl: './review.component.html',
  styles: [`
  .word {font-size:20px;}
  .translation .word {font-size:24px;}
  .genus,.subword {font-size:14px;}
  li{height:80px;}
  .translation .list-group-item{border:0;}
  li .fa {width: 40px;}
  .btn .fa {margin-right:3px;}
  .no {font-size:20px; margin-top:8px; margin-right:10px;}
  .scorebarwrapper {margin-left:42px;}
  `]
})

export class Review implements OnInit {
  @Input() words: WordPair[];
  selected: number;
  translation: Word = {word: '', article: '', genus: ''};
  translationPf: Word = null;
  ready = false;
  settings: AllSettings;

  constructor (
    private settingsService: SettingsService,
    private errorService: ErrorService
  ) {}

  ngOnInit() {
    this.words.forEach(word => {
      if (!word.answer) {
        word.answer = {_id: null, total: {correct: 0, incorrect: 0}};
    }});
    this.settingsService
    .getAppSettings()
    .takeWhile(() => !this.ready)
    .subscribe(
      settings => {
        this.settings = settings.all;
        this.ready = true;
      },
      error => this.errorService.handleError(error)
    );
  }

  isUndefined(correct: boolean): boolean {
    return (typeof correct === 'undefined');
  }

  getColor(correct: boolean): string {
    if (this.isUndefined(correct)) {
      return 'grey';
    } else {
      return correct ? 'green' : 'red';
    }
  }

  onSelected(i: number) {
    const word = this.words[i];
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
    if (word.tpe === 'verb' && this.settings.lanDir === 'nlcz') {
      // Show perfective for this verb
      tgtword = this.words[i].czP;
      if (tgtword) {
        this.translationPf = {word: '', article: '', genus: ''};
        this.translationPf.word = tgtword.word;
        this.translationPf.case = tgtword.case;
        this.translationPf.firstpersonsingular = tgtword.firstpersonsingular;
        this.translationPf.aspect = 'pf';
      }
    }
  }
}
