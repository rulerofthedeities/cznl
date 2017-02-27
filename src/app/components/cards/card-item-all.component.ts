import {Component, Input, Output, EventEmitter,
  trigger, style, transition, animate, keyframes} from '@angular/core';
import {WordPair, Direction} from '../../models/word.model';
import {AllSettings} from '../../models/settings.model';
import {WordService} from '../../services/words.service';
import {ErrorService} from '../../services/error.service';

@Component({
  selector: 'card-item-all',
  templateUrl: 'card-item-all.component.html',
  styleUrls: ['./card.component.css']
})

export class CardItemAllComponent {
  @Input() card: WordPair;
  @Input() settings: AllSettings;
  @Input() test: string;
  @Output() cardTurned = new EventEmitter<number>();
  iseven = true; // Force refresh of data

  constructor(
    private wordService: WordService,
    private errorService: ErrorService
  ) {}

  turnCard() {
    event.stopPropagation();
    this.cardTurned.emit(Direction.Right);
    this.iseven = !this.iseven;
  }

  goBack() {
    event.stopPropagation();
    this.cardTurned.emit(Direction.Left);
    this.iseven = !this.iseven;
  }

  getQuestionData() {
    return this.settings.lanDir === 'cznl' ? this.card.cz : this.card.nl;
  }

  getAnswerData(perfective: boolean) {
    let cardData = null,
        cardDataPf = null;
    if (this.settings.lanDir === 'cznl') {
      cardData = this.card.nl;
    } else {
      cardData = this.card.cz;
      if (this.card.tpe === 'verb') {
        cardData.aspect = 'impf';
        cardDataPf = this.card.perfective ? this.card.cz : this.card.czP;
        if (cardDataPf || this.card.perfective) {
          cardDataPf.aspect = 'pf';
        }
      }
    }

    return perfective ? cardDataPf : cardData;
  }

  hasPerfective() {
    return !!this.card.czP;
  }
}
