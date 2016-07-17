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
var restart_service_1 = require('../../services/restart.service');
var CardScore = (function () {
    function CardScore(restartService) {
        this.restartService = restartService;
        this.restart = new core_1.EventEmitter();
    }
    CardScore.prototype.ngOnInit = function () {
        this.scoreDisplay = this.correct + '/' + this.total;
        this.percDisplay = Math.round(this.correct / this.total * 100).toString();
    };
    CardScore.prototype.doRestart = function () {
        this.restart.emit(true);
    };
    CardScore.prototype.doNewTest = function () {
        this.restartService.restartTest();
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], CardScore.prototype, "correct", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], CardScore.prototype, "total", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], CardScore.prototype, "restart", void 0);
    CardScore = __decorate([
        core_1.Component({
            selector: 'card-score',
            template: "\n    <div class=\"card center-block text-center score\">\n      <h4>Test Completed!</h4>\n      <h2>Score: {{scoreDisplay}}</h2>\n      <em>({{percDisplay}}%)</em>\n      <div class=\"clearfix\"></div>\n      <button \n        class=\"btn btn-success\"\n        (click)=\"doRestart()\">\n        Probeer opnieuw\n      </button>\n      <button \n        class=\"btn btn-success\"\n        (click)=\"doNewTest()\">\n        Nieuwe test\n      </button>\n    </div>",
            styleUrls: ['app/components/cards/card.component.css']
        }), 
        __metadata('design:paramtypes', [restart_service_1.RestartService])
    ], CardScore);
    return CardScore;
}());
exports.CardScore = CardScore;
//# sourceMappingURL=card-score.component.js.map