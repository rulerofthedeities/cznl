import {bootstrap}    from '@angular/platform-browser-dynamic';
import {AppComponent} from './components/app.component';
import {appRouterProviders} from './components/routes.component';
import {SettingsService} from './services/settings.service';
import {disableDeprecatedForms, provideForms} from '@angular/forms';

bootstrap(AppComponent, [
  disableDeprecatedForms(),
  provideForms(),
	appRouterProviders,
  SettingsService])
.catch(err => console.error(err));
