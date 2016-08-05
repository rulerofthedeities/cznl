import {provideRouter, RouterConfig} from '@angular/router';
import {Tests} from './tests.component';
import {Dashboard} from './dashboard.component';
import {WordBank} from './wordbank.component';
import {AppSettings} from './settings.component';

const routes: RouterConfig = [
  { path: '', component: WordBank },
  { path: 'dashboard', component: Dashboard },
  { path: 'tests', component: Tests },
  { path: 'words', component: WordBank },
  { path: 'settings', component: AppSettings }
];

export const appRouterProviders = [
  provideRouter(routes)
];
