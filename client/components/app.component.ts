import {Component} from '@angular/core';

@Component({
  selector: 'cz',
  template: `
    <div class="container">
      <menu-bar></menu-bar>
      <router-outlet></router-outlet>
      <error-msg></error-msg>
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

export class AppComponent {}
