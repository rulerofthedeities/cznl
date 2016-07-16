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
var filters_service_1 = require('../../services/filters.service');
var Filter = (function () {
    function Filter(filterService) {
        this.filterService = filterService;
        this.selectedFilter = new core_1.EventEmitter();
    }
    Filter.prototype.ngOnInit = function () {
        this.getFilterData();
    };
    Filter.prototype.startTest = function (level, wordtpe, cats) {
        var filterObj = {
            'level': level,
            'tpe': wordtpe,
            'cats': cats
        };
        this.selectedFilter.emit(filterObj);
    };
    Filter.prototype.getFilterData = function () {
        var _this = this;
        this.filterService.getFilterData().then(function (filters) {
            _this.filters = filters;
        });
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], Filter.prototype, "tpe", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], Filter.prototype, "selectedFilter", void 0);
    Filter = __decorate([
        core_1.Component({
            selector: 'filter',
            providers: [filters_service_1.FilterService],
            template: "\n  <div [ngSwitch]=\"tpe\" *ngIf=\"filters\" class=\"filter\">\n    <ul *ngSwitchCase=\"'default'\" class=\"list-unstyled\">\n      <li>\n        <select #level class=\"form-control\">\n          <option \n            *ngFor=\"let level of filters.levels\">\n            {{level}}\n          </option>\n        </select>\n      </li>\n      <li>\n        <select #wordtpe class=\"form-control\">\n          <option \n            *ngFor=\"let tpe of filters.tpes\">\n            {{tpe}}\n          </option>\n        </select>\n      </li>\n      <li>\n        <select #cats class=\"form-control\">\n          <option \n            *ngFor=\"let cat of filters.cats\">\n            {{cat}}\n          </option>\n        </select>\n      </li>\n      <li \n        class=\"btn btn-success btn-lg\" \n        (click)=\"startTest(level.value, wordtpe.value, cats.value)\">\n        Start Test\n      </li>\n    </ul>\n    <ul \n      *ngSwitchCase=\"'user'\"\n      class=\"list-group\">\n      <li class=\"list-group-item\">Lijst 1<span class=\"badge\">12</span></li>\n      <li class=\"list-group-item\">Lijst 2<span class=\"badge\">8</span></li>\n      <li\n        class=\"btn btn-success btn-lg disabled\">\n        Start Test\n      </li>\n    </ul>\n  </div>",
            styles: ["\n    .filter {margin: 0 20px;}\n    .btn {margin-top: 6px;}\n  "]
        }), 
        __metadata('design:paramtypes', [filters_service_1.FilterService])
    ], Filter);
    return Filter;
}());
exports.Filter = Filter;
//# sourceMappingURL=filter.component.js.map