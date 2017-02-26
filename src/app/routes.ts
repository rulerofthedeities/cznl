import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {Tests} from './components/tests.component';
import {WordBank} from './components/wordbank.component';
import {AppSettings} from './components/settings.component';
import {Progress} from './components/progress.component';
import {SignUp} from './components/auth/sign-up.component';
import {SignIn} from './components/auth/sign-in.component';
import {AuthMenu} from './components/auth/auth-menu.component';
import {PageNotFoundComponent} from './components/page-not-found.component';
import {AuthGuard} from './services/auth-guard.service';
import {AuthRoleGuard} from './services/auth-role-guard.service';
import {AccessResolver} from './resolves/access.resolver';
import {CanDeactivateGuard} from './services/candeactivate-guard.service';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: Tests,
    canActivate: [AuthGuard],
    resolve: {access: AccessResolver}
  },
  {
    path: 'tests',
    component: Tests,
    canActivate: [AuthGuard],
    canDeactivate: [CanDeactivateGuard],
    resolve: {access: AccessResolver}
  },
  {
    path: 'words',
    component: WordBank,
    canActivate: [AuthGuard, AuthRoleGuard]
  },
  {
    path: 'settings',
    component: AppSettings,
    canActivate: [AuthGuard],
    resolve: {access: AccessResolver}
  },
  {
    path: 'progress',
    component: Progress,
    canActivate: [AuthGuard],
    resolve: {access: AccessResolver}
  },
  {
    path: 'auth',
    component: AuthMenu,
    children: [
      {
        path: '',
        redirectTo: '/auth/signin',
        pathMatch: 'full'
      },
      {path: 'signup', component: SignUp},
      {path: 'signin', component: SignIn}
    ]
  },
  {
    // To be replaced with Not found component
    path: '**',
    component: PageNotFoundComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
