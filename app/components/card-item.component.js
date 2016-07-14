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
        this.cardType = 'question';
    }
    CardItem.prototype.ngOnInit = function () {
        this.cardData = this.cardType === 'question' ? this.card.src : this.card.tgt;
        this.cardData.tpe = this.card.tpe;
    };
    __decorate([
        core_1.Input('tpe'), 
        __metadata('design:type', String)
    ], CardItem.prototype, "cardType", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', word_model_1.WordPair)
    ], CardItem.prototype, "card", void 0);
    CardItem = __decorate([
        core_1.Component({
            selector: 'card-item',
            template: "\n    <div>\n      {{cardData.article}}<h1>{{cardData.word}}</h1>\n      <em>{{cardData.genus}} / {{cardData.tpe}}</em>\n    </div>\n    {{card |json}}"
        }), 
        __metadata('design:paramtypes', [])
    ], CardItem);
    return CardItem;
}());
exports.CardItem = CardItem;
//# sourceMappingURL=card-item.component.js.map