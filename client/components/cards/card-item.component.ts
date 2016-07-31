import {Component, Input, Output, EventEmitter, OnChanges} from '@angular/core';
import {AddToList} from '../wordlists/add-to-list.component';
import {WordPair, Word} from '../../models/word.model';
import {AllSettings} from '../../models/settings.model';
import {WordService} from '../../services/words.service';

@Component({
  selector: 'card-item',
  directives: [AddToList],
  template: `
    <div class="card center-block">
      <add-to-list
        [word]="card"
      ></add-to-list>
      <div 
        *ngIf="isQuestion"
        (click)="turnCard()"
        class="question text-center">
        <div class="wordwrapper center-block">
            <h2 class="word">{{cardData.word}}</h2>
        </div>
        <em>{{card.tpe}}</em>
      </div>
      <div *ngIf="!isQuestion" class="answer">
        <div class="wordwrapper center-block">
            <div class="word" *ngIf="settings.showPronoun">{{cardData.article}}</div>
            <h2 class="word">{{cardData.word}}</h2>
        </div>
        <div class="clearfix">
          <div 
            class="btn btn-success btn-sm pull-right" 
            (click)="answerCard(true)">
            Juist
          </div>
          <div 
            class="btn btn-danger btn-sm pull-left" 
            (click)="answerCard(false)">
            Fout
          </div>
        </div>
    </div>`,
  styleUrls: ['client/components/cards/card.component.css']
})

export class CardItem implements OnChanges {
  @Input() card: WordPair;
  @Input() settings: AllSettings;
  @Output() cardAnswered = new EventEmitter();
  isQuestion = true;
  cardData: Word;

  constructor(private wordService: WordService) {}

  ngOnChanges() {
    this.getCardData();
  }

  turnCard() {
    this.isQuestion = !this.isQuestion;
    this.getCardData();
  }

  answerCard(correct: boolean) {
    this.cardAnswered.emit(correct);
    this.turnCard();
    this.wordService.saveAnswer('demoUser', this.card._id, correct);
  }

  getCardData() {
    if (this.isQuestion) {
      this.cardData = this.settings.lanDir === 'cznl' ? this.card.cz : this.card.nl;
    } else {
      this.cardData = this.settings.lanDir === 'cznl' ? this.card.nl : this.card.cz;
    }
  }

}
