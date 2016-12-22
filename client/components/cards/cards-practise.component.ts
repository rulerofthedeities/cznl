import {Component, Input, OnInit} from '@angular/core';
import {SettingsService} from '../../services/settings.service';
import {ErrorService} from '../../services/error.service';
import {UtilsService} from '../../services/utils.service';
import {WordPair} from '../../models/word.model';
import {Subscription}   from 'rxjs/Subscription';

@Component({
  selector: 'cards-practise',
  template: `
    <div>
      <div 
        class="text-center progress"
        *ngIf="!isFinished">
        <div 
          class="progress-bar" 
          role="progressbar" 
          [attr.aria-valuenow]="progress"
          aria-valuemin="0" 
          aria-valuemax="100" 
          [style.width.%]="progress">
          <span>
            {{cardsIndex}}/{{maxCards}}
          </span>
        </div>
      </div>
      <card-item-all *ngIf="currentCard"
        [card]="currentCard"
        [settings]="settings"
        (cardTurned)="onCardTurned($event)">
      </card-item-all>
    </div>`
})

export class CardsPractise implements OnInit {
  @Input('data') cards: WordPair[];
  maxCards: number;
  cardsIndex:number;
  progress: number;
  currentCard: WordPair;
  subscription: Subscription;
  settings: Object;

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
    this.settingsService.getAppSettings().subscribe(
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

  onCardTurned(direction: number) {
    this.cardsIndex += direction;
    if (this.cardsIndex > this.cards.length) {
      this.cardsIndex = 1;
    } else if (this.cardsIndex < 1) {
      this.cardsIndex = this.cards.length;
    }
    this.getNextCard();
  }

  onRestart(isRestart: boolean) {
    this.reset();
    this.cards = this.utilsService.shuffle(this.cards);
    this.getNextCard();
  }

  reset() {
    this.progress = 0;
    this.cardsIndex = 1;
  }
}
