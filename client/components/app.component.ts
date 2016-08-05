import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {Menu} from './menu.component';
import {RestartService} from '../services/restart.service';
import {FilterService} from '../services/filters.service';
import {WordService} from '../services/words.service';

@Component({
  selector: 'cz',
  directives: [ROUTER_DIRECTIVES, Menu],
  providers: [RestartService, FilterService, WordService],
  template: `
    <div class="container">
      <div class="panel-top">
        <menu></menu>
      </div>
      <div class="panel-main">
        <router-outlet></router-outlet>
      </div>
    </div>`,
    styles: [`
      .panel-top {
        background-color:#eee;
        border: 1px solid #ddd;
      }
      .panel-main {
        background-color:#fefefe;
        border:1px solid #eee;
        padding: 20px 0;
        margin-top:6px;
      }
    `]
})
export class AppComponent {

}
