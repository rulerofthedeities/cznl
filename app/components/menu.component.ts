import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

@Component({
  selector: 'menu',
  directives: [ROUTER_DIRECTIVES],
  template: `
    <ul>
      <li><a [routerLink]="['/tests']">Tests</a></li>
      <li><a [routerLink]="['/add-words']">Add new words</a></li>
      <li><a [routerLink]="['/settings']">Settings</a></li>
    </ul>
    <router-outlet></router-outlet>
  `
})

export class Menu {

}
