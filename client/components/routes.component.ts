import {provideRouter, RouterConfig} from '@angular/router';
import {Tests} from './tests.component';
import {Dashboard} from './dashboard.component';
import {AddWord} from './add-word.component';
import {AppSettings} from './settings.component';

const routes: RouterConfig = [
  { path: '', component: Tests },
  { path: 'dashboard', component: Dashboard },
  { path: 'tests', component: Tests },
  { path: 'add-words', component: AddWord },
  { path: 'settings', component: AppSettings }
];

export const appRouterProviders = [
  provideRouter(routes)
];
