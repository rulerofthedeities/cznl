import {Component, Input, Output, EventEmitter, OnChanges, OnDestroy,
  trigger, style, transition, animate, keyframes} from '@angular/core';
import {WordPair, Word, Total} from '../../models/word.model';
import {AllSettings} from '../../models/settings.model';
import {WordService} from '../../services/words.service';
import {ErrorService} from '../../services/error.service';
import 'rxjs/add/operator/takeWhile';

@Component({
  selector: 'card-item',
  templateUrl: 'card-item.component.html',
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

export class CardItemComponent implements OnChanges, OnDestroy {
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
        console.log('answer', answer);
        this.cardAnswered.emit(correct);
        this.updateTotals(correct, answer.upserted);
        this.turnCard(true);
      },
      error => this.errorService.handleError(error)
    );
  }

  getCardData() {
    if (this.isQuestion) {
      this.cardData = this.settings.lanDir === 'cznl' ? this.card.cz : this.card.nl;
      this.cardDataPf = this.settings.lanDir === 'nlcz' && this.card.tpe === 'verb' ? this.card.nlP : null;
    } else {
      this.cardDataPf = null;
      if (this.settings.lanDir === 'cznl') {
        this.cardData = this.card.nl;
      } else {
        this.cardData = this.card.cz;
        if (this.card.tpe === 'verb') {
          this.cardData.aspect =  this.card.perfective ? 'pf' : 'impf';
          this.cardDataPf = this.card.czP;
          if (this.cardDataPf) {
            this.cardDataPf.aspect = 'pf';
          }
        }
      }
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
