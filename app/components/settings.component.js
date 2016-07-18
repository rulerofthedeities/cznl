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
var Settings = (function () {
    function Settings() {
        this.isReady = true;
        this.isSubmitted = false;
    }
    Settings.prototype.ngOnInit = function () {
        this.testLength = [10, 25, 50, 100];
        this.directions = [
            { label: 'Nederlands -> Tsjechisch', val: 'nlcz' },
            { label: 'Tsjechisch -> Nederlands', val: 'cznl' }
        ];
        this.settings = {
            wordCnt: 25,
            lanDir: 'nlcz'
        };
        this.isReady = true;
    };
    Settings.prototype.onSubmit = function () {
        this.isSubmitted = true;
    };
    Settings = __decorate([
        core_1.Component({
            selector: 'settings',
            templateUrl: 'app/components/settings.component.html'
        }), 
        __metadata('design:paramtypes', [])
    ], Settings);
    return Settings;
}());
exports.Settings = Settings;
//# sourceMappingURL=settings.component.js.map