import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {TestsComponent} from './components/tests.component';
import {WordBankComponent} from './components/wordbank.component';
import {AppSettingsComponent} from './components/settings.component';
import {ProgressComponent} from './components/progress.component';
import {SignUpComponent} from './components/auth/sign-up.component';
import {SignInComponent} from './components/auth/sign-in.component';
import {AuthMenuComponent} from './components/auth/auth-menu.component';
import {PageNotFoundComponent} from './components/page-not-found.component';
import {AuthGuard} from './services/auth-guard.service';
import {AuthRoleGuard} from './services/auth-role-guard.service';
import {AccessResolver} from './resolves/access.resolver';
import {CanDeactivateGuard} from './services/candeactivate-guard.service';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: TestsComponent,
    canActivate: [AuthGuard],
    resolve: {access: AccessResolver}
  },
  {
    path: 'tests',
    component: TestsComponent,
    canActivate: [AuthGuard],
    canDeactivate: [CanDeactivateGuard],
    resolve: {access: AccessResolver}
  },
  {
    path: 'words',
    component: WordBankComponent,
    canActivate: [AuthGuard, AuthRoleGuard]
  },
  {
    path: 'settings',
    component: AppSettingsComponent,
    canActivate: [AuthGuard],
    resolve: {access: AccessResolver}
  },
  {
    path: 'progress',
    component: ProgressComponent,
    canActivate: [AuthGuard],
    resolve: {access: AccessResolver}
  },
  {
    path: 'auth',
    component: AuthMenuComponent,
    children: [
      {
        path: '',
        redirectTo: '/auth/signin',
        pathMatch: 'full'
      },
      {path: 'signup', component: SignUpComponent},
      {path: 'signin', component: SignInComponent}
    ]
  },
  {
    // To be replaced with Not found component
    path: '**',
    component: PageNotFoundComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
