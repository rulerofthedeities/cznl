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
var word_model_1 = require('../model/word.model');
var CardItem = (function () {
    function CardItem() {
        this.cardAnswered = new core_1.EventEmitter();
        this.isQuestion = true;
    }
    CardItem.prototype.ngOnChanges = function () {
        this.getCardData();
    };
    CardItem.prototype.turnCard = function () {
        this.isQuestion = !this.isQuestion;
        this.getCardData();
    };
    CardItem.prototype.answerCard = function (correct) {
        this.cardAnswered.emit(correct);
        this.turnCard();
    };
    CardItem.prototype.getCardData = function () {
        this.cardData = this.isQuestion ? this.card.src : this.card.tgt;
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', word_model_1.WordPair)
    ], CardItem.prototype, "card", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], CardItem.prototype, "cardAnswered", void 0);
    CardItem = __decorate([
        core_1.Component({
            selector: 'card-item',
            template: "\n    <div class=\"card\">\n      <div \n        *ngIf=\"isQuestion\"\n        (click)=\"turnCard()\"\n        class=\"question\">\n        QUESTION <br>\n        {{cardData.article}}<h1>{{cardData.word}}</h1>\n        <em>{{cardData.genus}} / {{card.tpe}}</em>\n      </div>\n      <div *ngIf=\"!isQuestion\" class=\"answer\">\n        ANSWER <br>\n         {{cardData.article}}<h1>{{cardData.word}}</h1>\n         <div class=\"button\" (click)=\"answerCard(true)\">Correct</div>\n         <div class=\"button\" (click)=\"answerCard(false)\">Incorrect</div>\n      </div>\n    </div>",
            styles: [
                "div.question, div.button {cursor:pointer;}"]
        }), 
        __metadata('design:paramtypes', [])
    ], CardItem);
    return CardItem;
}());
exports.CardItem = CardItem;
//# sourceMappingURL=card-item.component.js.map