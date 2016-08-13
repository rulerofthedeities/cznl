import {bootstrap}    from '@angular/platform-browser-dynamic';
import {AppComponent} from './components/app.component';
import {HTTP_PROVIDERS} from '@angular/http';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import {appRouterProviders} from './components/routes.component';
import {SettingsService} from './services/settings.service';
import {disableDeprecatedForms, provideForms} from '@angular/forms';
import {provide} from '@angular/core';

bootstrap(AppComponent, [
  HTTP_PROVIDERS,
  disableDeprecatedForms(),
  provideForms(),
	appRouterProviders,
  provide(LocationStrategy, {useClass: HashLocationStrategy}),
  SettingsService])
.catch(err => console.error(err));
