import {bootstrap}    from '@angular/platform-browser-dynamic';
import {AppComponent} from './components/app.component';
import {HTTP_PROVIDERS} from '@angular/http';
import {appRouterProviders} from './components/routes.component';
import {SettingsService} from './services/settings.service';
import {disableDeprecatedForms, provideForms} from '@angular/forms';

bootstrap(AppComponent, [
  HTTP_PROVIDERS,
  disableDeprecatedForms(),
  provideForms(),
	appRouterProviders,
  SettingsService])
.catch(err => console.error(err));
