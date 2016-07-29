import {Component, Input, Output, EventEmitter, OnChanges} from '@angular/core';
import {WordPair, Word} from '../../models/word.model';
import {AllSettings} from '../../models/settings.model';
import {WordService} from '../../services/words.service';

@Component({
  selector: 'card-item',
  template: `
    <div class="card center-block">
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
      this.card.tpe = this.getCardTypeName(this.card.tpe);
    } else {
      this.cardData = this.settings.lanDir === 'cznl' ? this.card.nl : this.card.cz;
      this.cardData.article = this.getCardArticle(this.cardData.genus);
    }
  }

  getCardArticle(genus: string) {
    let article: string;
    switch (genus) {
      case 'Ma':
      case 'Mi': article = 'ten'; break;
      case 'F': article = 'ta'; break;
      case 'O': article = 'to'; break;
      default: article = '';
    }

    return article;
  }

  getCardTypeName(tpe: string) {
    let newTpe: string;
    switch (tpe) {
      case 'noun': newTpe = 'Zelfst. Naamwoord'; break;
      default: newTpe = tpe;
    }

    return newTpe;
  }
}
