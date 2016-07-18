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
var filter_component_1 = require('./common/filter.component');
var cards_component_1 = require('./cards/cards.component');
var words_service_1 = require('../services/words.service');
var restart_service_1 = require('../services/restart.service');
var Tests = (function () {
    function Tests(wordService, restartService) {
        var _this = this;
        this.wordService = wordService;
        this.listType = 'default';
        this.started = false;
        this.subscription = restartService.restartFilter$.subscribe(function (start) {
            _this.restart();
        });
    }
    Tests.prototype.selectListType = function (tpe) {
        this.listType = tpe;
    };
    Tests.prototype.onSelectFilter = function (filter) {
        this.filterData = filter;
        this.getWords(filter);
    };
    Tests.prototype.getWords = function (filter) {
        var _this = this;
        this.wordService.getWords(filter)
            .then(function (wordlist) {
            _this.cards = wordlist;
            _this.started = true;
        });
    };
    Tests.prototype.restart = function () {
        this.started = false;
    };
    Tests.prototype.ngOnDestroy = function () {
        // prevent memory leak when component destroyed
        this.subscription.unsubscribe();
    };
    Tests = __decorate([
        core_1.Component({
            selector: 'tests',
            directives: [filter_component_1.Filter, cards_component_1.Cards],
            providers: [words_service_1.WordService, restart_service_1.RestartService],
            template: "\n  <div class=\"row\">\n    <div *ngIf=\"!started\" class=\"col-xs-4\">\n      <ul class=\"btn-group-vertical btn-group-sm\">\n        <li \n          (click)=\"selectListType('default')\"\n          class=\"btn\"\n          [ngClass]=\"{'btn-primary':listType==='default'}\">\n          Selecteer woordenlijst\n        </li>\n        <li \n          (click)=\"selectListType('user')\"\n          class=\"btn\"\n          [ngClass]=\"{'btn-primary':listType==='user'}\">\n          Mijn woordenlijst\n        </li>\n      </ul>\n    </div>\n    <filter *ngIf=\"!started\"\n      [tpe]=\"listType\"\n      (selectedFilter)=\"onSelectFilter($event)\"\n      class=\"col-xs-8\">\n    </filter>\n    <div *ngIf=\"started\" class=\"col-xs-12\">\n      <cards \n        [data]=\"cards\">\n      </cards>\n    </div>\n  </div>\n  ",
            styles: [
                "li {cursor:pointer;}"]
        }), 
        __metadata('design:paramtypes', [words_service_1.WordService, restart_service_1.RestartService])
    ], Tests);
    return Tests;
}());
exports.Tests = Tests;
//# sourceMappingURL=tests.component.js.map