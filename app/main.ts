import {bootstrap}    from '@angular/platform-browser-dynamic';
import {AppComponent} from './components/app.component';
import {appRouterProviders} from './components/routes.component';
import {disableDeprecatedForms, provideForms} from '@angular/forms';

bootstrap(AppComponent, [
  disableDeprecatedForms(),
  provideForms(),
	appRouterProviders])
.catch(err => console.error(err));
