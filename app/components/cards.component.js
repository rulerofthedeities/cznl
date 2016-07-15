"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var settings_service_1 = require('../services/settings.service');
var card_item_component_1 = require('./card-item.component');
var Cards = (function () {
    function Cards(settingsService) {
        this.settingsService = settingsService;
        this.cardsIndex = 0;
        this.maxCards = 20;
        this.isFinished = false;
        this.correct = 0;
    }
    Cards.prototype.ngOnInit = function () {
        this.getSettings();
    };
    Cards.prototype.getSettings = function () {
        var _this = this;
        this.settingsService.getSettings()
            .then(function (settings) {
            _this.maxCards = settings.maxCards;
            _this.getNextCard();
        });
    };
    Cards.prototype.getNextCard = function () {
        if (this.cardsIndex < this.cards.length) {
            this.currentCard = this.cards[this.cardsIndex++];
        }
        else {
            this.currentCard = null;
            this.isFinished = true;
        }
    };
    Cards.prototype.onCardAnswered = function (isCorrect) {
        this.getNextCard();
        if (isCorrect) {
            this.correct++;
        }
    };
    __decorate([
        core_1.Input('data'), 
        __metadata('design:type', Array)
    ], Cards.prototype, "cards", void 0);
    Cards = __decorate([
        core_1.Component({
            selector: 'cards',
            directives: [card_item_component_1.CardItem],
            providers: [settings_service_1.SettingsService],
            template: "\n    <div>CARDS\n      <div>{{cardsIndex}}/{{maxCards}}</div>\n      <card-item \n        *ngIf=\"currentCard\"\n        [card]=\"currentCard\"\n        (cardAnswered)=\"onCardAnswered($event)\">\n      </card-item>\n      <div *ngIf=\"isFinished\">\n        <h1>FINISHED</h1>\n        score: {{correct}}\n      </div>\n    </div>"
        }), 
        __metadata('design:paramtypes', [settings_service_1.SettingsService])
    ], Cards);
    return Cards;
}());
exports.Cards = Cards;
//# sourceMappingURL=cards.component.js.map