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
var Tests = (function () {
    function Tests() {
        this.listType = 'default';
        this.started = false;
    }
    Tests.prototype.selectListType = function (tpe) {
        this.listType = tpe;
    };
    Tests.prototype.onSelectFilter = function (filter) {
        this.filterData = filter;
        this.started = true;
    };
    Tests = __decorate([
        core_1.Component({
            selector: 'tests',
            directives: [filter_component_1.Filter],
            template: "\n  <h1>Word tests</h1>\n  <ul>\n    <li (click)=\"selectListType('default')\">Selecteer woordenlijst</li>\n    <li (click)=\"selectListType('user')\">Mijn woordenlijst</li>\n  </ul>\n  <filter *ngIf=\"!started\"\n    [tpe]=\"listType\"\n    (selectedFilter)=\"onSelectFilter($event)\">\n  </filter>\n  <div *ngIf=\"started\">\n    Filter data: {{filterData|json}}\n  </div>\n\n  ",
            styles: [
                "li {cursor:pointer;}"]
        }), 
        __metadata('design:paramtypes', [])
    ], Tests);
    return Tests;
}());
exports.Tests = Tests;
//# sourceMappingURL=tests.component.js.map