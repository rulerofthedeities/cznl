"use strict";
var router_1 = require('@angular/router');
var tests_component_1 = require('./tests.component');
var add_word_component_1 = require('./add-word.component');
var settings_component_1 = require('./settings.component');
var routes = [
    { path: 'tests', component: tests_component_1.Tests },
    { path: 'add-words', component: add_word_component_1.AddWord },
    { path: 'settings', component: settings_component_1.Settings }
];
exports.appRouterProviders = [
    router_1.provideRouter(routes)
];
//# sourceMappingURL=routes.component.js.map