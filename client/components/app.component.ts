import {Component} from '@angular/core';

@Component({
  selector: 'cz',
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

export class AppComponent {}
