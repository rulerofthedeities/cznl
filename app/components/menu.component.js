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
var router_1 = require('@angular/router');
var Menu = (function () {
    function Menu(router) {
        this.router = router;
    }
    Menu.prototype.ngOnInit = function () {
        var _this = this;
        this.routes = [
            { path: '/tests', label: 'Tests', glyph: 'list-alt' },
            { path: '/add-words', label: 'Add Words', glyph: 'plus' },
            { path: '/settings', label: 'Settings', glyph: 'cog' }
        ];
        this.subscription = this.router.events.subscribe(function (event) { return _this.url = event.url; });
    };
    Menu.prototype.ngOnDestroy = function () {
        // prevent memory leak when component is destroyed
        this.subscription.unsubscribe();
    };
    Menu = __decorate([
        core_1.Component({
            selector: 'menu',
            directives: [router_1.ROUTER_DIRECTIVES],
            template: "\n    <nav>\n      <ul class=\"nav nav-pills\">\n        <li \n          *ngFor=\"let route of routes\"\n          [ngClass]=\"{'active':url===route.path}\">\n          <a [routerLink]=\"[route.path]\">\n            <span \n              class=\"glyphicon glyphicon-{{route.glyph}}\" \n              aria-hidden=\"true\">\n            </span>\n            {{route.label}}\n          </a>\n        </li>\n      </ul>\n    </nav>\n  ",
            styles: ["\n    .nav li a {\n      line-height: 50px;\n      height: 50px;\n      font-size: 1.5em;\n      padding-top: 0;\n    }\n  "]
        }), 
        __metadata('design:paramtypes', [router_1.Router])
    ], Menu);
    return Menu;
}());
exports.Menu = Menu;
//# sourceMappingURL=menu.component.js.map