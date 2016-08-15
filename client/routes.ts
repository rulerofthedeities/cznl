import {Routes, RouterModule} from '@angular/router';
import {Tests} from './components/tests.component';
import {Dashboard} from './components/dashboard.component';
import {WordBank} from './components/wordbank.component';
import {AppSettings} from './components/settings.component';

const routes: Routes = [
  {path: '', component: Tests},
  {path: 'dashboard', component: Dashboard },
  {path: 'tests', component: Tests },
  {path: 'words', component: WordBank },
  {path: 'settings', component: AppSettings }
];

export const routing = RouterModule.forRoot(routes);
