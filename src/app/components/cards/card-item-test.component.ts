import {Component, Input, Output, EventEmitter, OnChanges, OnDestroy,
  trigger, style, transition, animate, keyframes} from '@angular/core';
import {WordPair, Word, Total, CardQA} from '../../models/word.model';
import {AllSettings} from '../../models/settings.model';
import {WordService} from '../../services/words.service';
import {ErrorService} from '../../services/error.service';
import 'rxjs/add/operator/takeWhile';

@Component({
  selector: 'card-item-test',
  templateUrl: 'card-item-test.component.html',
  styleUrls: ['./card.component.css'],
  animations: [
    trigger('cardState', [
      transition('question => answer', animate(300, keyframes([
        style({color: '#fff', transform: 'scaleX(0)'}),
        style({transform: 'scaleX(1)'})
      ]))),
      transition('answer => question', animate(500, keyframes([
        style({borderColor: '#999', color: '#ddd', transform: 'rotate(300deg)'}),
        style({borderColor: '#fff', color: '#fff', transform: 'translateX(400%)'})
      ])))
    ])
  ]
})

export class CardItemTestComponent implements OnChanges, OnDestroy {
  @Input() card: WordPair;
  @Input() settings: AllSettings;
  @Input() test: string;
  @Output() cardAnswered = new EventEmitter();
  isQuestion = true;
  cardData: Word;
  cardDataPf: Word;
  total: Total;
  state = 'question'; // For animation
  showAnswer = false;
  componentActive = true;

  constructor(
    private wordService: WordService,
    private errorService: ErrorService
  ) {}

  ngOnChanges() {
    this.getCardData();
  }

  turnCard(answered: boolean) {
    if (this.isQuestion || answered) {
      this.isQuestion = !this.isQuestion;
      this.state = this.isQuestion ? 'question' : 'answer';
      this.getCardData();
    }
  }

  answerCard(event: MouseEvent, correct: boolean) {
    event.stopPropagation();
    this.wordService
    .saveAnswer(this.card._id, correct)
    .takeWhile(() => this.componentActive)
    .subscribe(
      answer => {
        this.cardAnswered.emit(correct);
        this.updateTotals(correct, answer.upserted);
        this.turnCard(true);
      },
      error => this.errorService.handleError(error)
    );
  }

  getCardData() {
    const cardQA: CardQA = {
      card: this.card,
      settings: this.settings,
      isQuestion: true,
      perfective: false
    };

    if (this.isQuestion) {
      this.cardData = this.wordService.getCardData(cardQA);
    } else {
      cardQA.isQuestion = false;
      this.cardData = this.wordService.getCardData(cardQA);
      cardQA.perfective = true;
      this.cardDataPf = this.wordService.getCardData(cardQA);
    }

    this.total = this.card.answer && this.card.answer.total ? {
      correct: this.card.answer.total.correct ? this.card.answer.total.correct : 0,
      incorrect: this.card.answer.total.incorrect ? this.card.answer.total.incorrect : 0
    } : {
      correct: 0,
      incorrect: 0
    };
  }

  updateTotals(correct: boolean, upserted: Array<Object>) {
    if (!this.card.answer.total) {
      this.card.answer.total = {
        correct: 0,
        incorrect: 0
      };
    }
    if (correct) {
      this.card.answer.total.correct++;
    } else {
      this.card.answer.total.incorrect++;
    }
    if (upserted) {
      this.card.answer.review = false;
    } else {
      this.card.answer.review = true;
    }
  }

  ngOnDestroy() {
    event.stopPropagation();
    this.componentActive = false;
  }
}
