import {Component, OnInit, OnDestroy} from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router';
import {Subscription}   from 'rxjs/Subscription';

@Component({
  selector: 'menu',
  directives: [ROUTER_DIRECTIVES],
  template: `
    <nav>
      <ul class="nav nav-pills">
        <li 
          *ngFor="let route of routes"
          [ngClass]="{'active':url===route.path}">
          <a [routerLink]="[route.path]">
            <span 
              class="glyphicon glyphicon-{{route.glyph}}" 
              aria-hidden="true">
            </span>
            {{route.label}}
          </a>
        </li>
      </ul>
    </nav>
  `,
  styles:[`
    .nav li a {
      line-height: 50px;
      height: 50px;
      font-size: 1.5em;
      padding-top: 0;
    }
  `]
})

export class Menu implements OnInit, OnDestroy {
  subscription: Subscription;
  url: string;
  routes: Object[];

  constructor(private router: Router) {}

  ngOnInit() {
    this.routes = [
      {path:'/tests', label:'Tests', glyph:'list-alt'},
      {path:'/add-words', label:'Add Words', glyph:'plus'},
      {path:'/settings', label:'Settings', glyph:'cog'}
    ];
    this.subscription = this.router.events.subscribe(event => this.url = event.url);
  }

  ngOnDestroy() {
    // prevent memory leak when component is destroyed
    this.subscription.unsubscribe();
  }
}