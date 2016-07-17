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
        this.cardData = this.isQuestion ? this.card.nl : this.card.cz;
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], CardItem.prototype, "card", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], CardItem.prototype, "cardAnswered", void 0);
    CardItem = __decorate([
        core_1.Component({
            selector: 'card-item',
            template: "\n\n<div class=\"col-xs-10 col-xs-offset-1\">\n\n    <div class=\"card center-block\">\n      <div \n        *ngIf=\"isQuestion\"\n        (click)=\"turnCard()\"\n        class=\"question\">\n        <div class=\"wordwrapper center-block\">\n            <h2 class=\"word\">{{cardData.word}}</h2>\n        </div>\n        <div class=\"text-center\">\n          <em>{{card.tpe}}</em>\n        </div>\n      </div>\n      <div *ngIf=\"!isQuestion\" class=\"answer\">\n        <div class=\"wordwrapper center-block\">\n            <div class=\"word\">{{cardData.article}}</div>\n            <h2 class=\"word\">{{cardData.word}}</h2>\n        </div>\n        <div class=\"clearfix\">\n          <div \n            class=\"btn btn-success btn-xs pull-right\" \n            (click)=\"answerCard(true)\">\n            Correct\n          </div>\n          <div \n            class=\"btn btn-danger btn-xs pull-right\" \n            (click)=\"answerCard(false)\">\n            Incorrect\n          </div>\n        </div>\n      </div>\n    </div>",
            styles: ["\n    .wordwrapper {\n      display: table;\n      margin-top: 20px;\n      margin-bottom: 20px;\n    }\n    .word {\n      display: table-cell; \n      vertical-align: bottom;\n    }\n    h2.word {\n      padding-left:3px;\n    }\n    .tall{\n      font-size: 20px;\n    }\n    .card {\n      box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);\n      transition: 0.3s;\n      border-radius: 5px;\n      border: 1px solid #ddd;\n      padding: 12px;\n      max-width: 240px;\n    }\n    .card:hover {\n      box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);\n    }\n    div.question {cursor:pointer;}\n    div.answer .btn {margin:20px 6px 3px 3px;}\n  "]
        }), 
        __metadata('design:paramtypes', [])
    ], CardItem);
    return CardItem;
}());
exports.CardItem = CardItem;
//# sourceMappingURL=card-item.component.js.map