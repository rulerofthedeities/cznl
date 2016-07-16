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
var menu_component_1 = require('./menu.component');
var AppComponent = (function () {
    function AppComponent() {
    }
    AppComponent = __decorate([
        core_1.Component({
            selector: 'cz',
            directives: [router_1.ROUTER_DIRECTIVES, menu_component_1.Menu],
            template: "\n    <div class=\"container\">\n      <div class=\"panel-top\">\n        <menu></menu>\n      </div>\n      <div class=\"panel-main\">\n        <router-outlet></router-outlet>\n      </div>\n    </div>",
            styles: ["\n      .panel-top {\n        background-color:#eee;\n        border: 1px solid #ddd;\n      }\n      .panel-main {\n        background-color:#fefefe;\n        border:1px solid #eee;\n        padding: 20px 0;\n        margin-top:6px;\n      }\n    "]
        }), 
        __metadata('design:paramtypes', [])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map