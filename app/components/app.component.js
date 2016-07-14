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
var words_service_1 = require('../services/words.service');
var menu_component_1 = require('./menu.component');
var AppComponent = (function () {
    function AppComponent(wordService) {
        this.wordService = wordService;
    }
    AppComponent.prototype.ngOnInit = function () {
        this.getWords();
    };
    AppComponent.prototype.getWords = function () {
        var _this = this;
        this.wordService.getWords()
            .then(function (wordlist) { return _this.words = wordlist; });
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: 'cz',
            directives: [menu_component_1.Menu],
            providers: [words_service_1.WordService],
            template: "\n    <menu></menu>\n    <ul>\n      <li *ngFor=\"let word of words\">\n        {{word.src.word}} -> {{word.tgt.word}}\n      </li>\n    </ul>"
        }), 
        __metadata('design:paramtypes', [words_service_1.WordService])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map