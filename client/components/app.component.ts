import {Component, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {Observable} from 'rxjs/Observable';

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

export class AppComponent implements OnInit {
  constructor (private authService: AuthService) {}

  ngOnInit() {
    let timer = Observable.timer(30000, 3600000); //Start after 30 secs, then check every hour
    timer.subscribe(
      t => {
        if (this.authService.isLoggedIn()) {
          this.authService.keepTokenFresh();
        }
      }
    );
  }
}
