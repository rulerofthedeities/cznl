import {Component} from '@angular/core';
import {Menu} from './menu.component';

@Component({
  selector: 'cz',
  directives: [Menu],
  template: `
    <menu></menu>`
})
export class AppComponent {

}
