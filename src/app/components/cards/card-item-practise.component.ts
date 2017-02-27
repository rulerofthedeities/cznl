import {Component, Input, Output, EventEmitter,
  trigger, style, transition, animate, keyframes} from '@angular/core';
import {WordPair, Direction} from '../../models/word.model';
import {AllSettings} from '../../models/settings.model';
import {WordService} from '../../services/words.service';
import {ErrorService} from '../../services/error.service';

@Component({
  selector: 'card-item-practise',
  templateUrl: 'card-item-practise.component.html',
  styleUrls: ['./card.component.css']
})

export class CardItemPractiseComponent {
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
    return this.wordService.getCardData({
      card: this.card,
      isQuestion: true,
      perfective: false
    });
  }

  getAnswerData(perfective: boolean) {
    return this.wordService.getCardData({
      card: this.card,
      settings: this.settings,
      isQuestion: false,
      perfective
    });
  }

  hasPerfective() {
    return !!this.card.czP;
  }
}
