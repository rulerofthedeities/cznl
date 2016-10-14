import {Routes, RouterModule} from '@angular/router';
import {Tests} from './components/tests.component';
import {WordBank} from './components/wordbank.component';
import {AppSettings} from './components/settings.component';
import {SignUp} from './components/auth/sign-up.component';
import {SignIn} from './components/auth/sign-in.component';
import {AuthMenu} from './components/auth/auth-menu.component';
import {AuthGuard} from './services/auth-guard.service';
import {AuthRoleGuard} from './services/auth-role-guard.service';

const routes: Routes = [
  {path: '', component: Tests, canActivate: [AuthGuard]},
  {path: 'tests', component: Tests, canActivate: [AuthGuard]},
  {path: 'words',
    component: WordBank,
    canActivate: [AuthGuard, AuthRoleGuard]
  },
  {path: 'settings', component: AppSettings, canActivate: [AuthGuard]},
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
