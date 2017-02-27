import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {SettingsService} from '../../services/settings.service';
import {ErrorService} from '../../services/error.service';
import {UtilsService} from '../../services/utils.service';
import {WordPair, Direction} from '../../models/word.model';
import {AllSettings} from '../../models/settings.model';
import 'rxjs/add/operator/takeWhile';

@Component({
  selector: 'cards-practise',
  templateUrl: 'cards-practise.component.html'
})

export class CardsPractiseComponent implements OnInit, OnDestroy {
  @Input('data') cards: WordPair[];
  maxCards: number;
  cardsIndex: number;
  progress: number;
  currentCard: WordPair;
  settings: AllSettings;
  componentActive = true;

  constructor(
    private settingsService: SettingsService,
    private utilsService: UtilsService,
    private errorService: ErrorService
  ) {}

  ngOnInit() {
    this.reset();
    this.getSettings();
  }

  getSettings() {
    this.settingsService
    .getAppSettings()
    .takeWhile(() => this.componentActive)
    .subscribe(
      settings => {
        this.maxCards = Math.min(settings.all.maxWords, this.cards.length);
        this.settings = settings.all;
        this.getNextCard();
      },
      error => this.errorService.handleError(error)
    );
  }

  getNextCard() {
    this.currentCard = this.cards[this.cardsIndex - 1];
    this.progress = Math.trunc(this.cardsIndex / this.maxCards * 100);
  }

  onCardTurned(direction: Direction) {
    this.cardsIndex += direction;
    if (this.cardsIndex > this.cards.length) {
      this.cardsIndex = 1;
    } else if (this.cardsIndex < 1) {
      this.cardsIndex = this.cards.length;
    }
    this.getNextCard();
  }

  reset() {
    this.progress = 0;
    this.cardsIndex = 1;
  }

  ngOnDestroy() {
    this.componentActive = false;
  }
}
