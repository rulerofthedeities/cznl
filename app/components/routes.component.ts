import {provideRouter, RouterConfig} from '@angular/router';
import {Tests} from './tests.component';
import {AddWord} from './add-word.component';
import {Settings} from './settings.component';

const routes: RouterConfig = [
  { path: 'tests', component: Tests },
  { path: 'add-words', component: AddWord },
  { path: 'settings', component: Settings }
];

export const appRouterProviders = [
  provideRouter(routes)
];
