import {Routes, RouterModule} from '@angular/router';
import {Tests} from './components/tests.component';
import {WordBank} from './components/wordbank.component';
import {AppSettings} from './components/settings.component';
import {SignUp} from './components/auth/sign-up.component';
import {SignIn} from './components/auth/sign-in.component';
import {AuthMenu} from './components/auth/auth-menu.component';

const routes: Routes = [
  {path: '', component: Tests},
  {path: 'tests', component: Tests},
  {path: 'words', component: WordBank},
  {path: 'settings', component: AppSettings},
  {
    path: 'auth',
    component: AuthMenu,
    children: [
      {
        path: '',
        redirectTo: '/auth/signin',
        pathMatch: 'full',
        component: AuthMenu
      },
      {path: 'signup', component: SignUp},
      {path: 'signin', component: SignIn}
    ]
  }
];

export const routing = RouterModule.forRoot(routes);
