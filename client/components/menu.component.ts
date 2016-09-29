import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription}   from 'rxjs/Subscription';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'menu',
  template: `
    <div class="small text-right user">{{getUserName()}}</div>
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

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.routes = [
      {path:'/tests', label:'Oefeningen', glyph:'list-alt'},
      {path:'/words', label:'Woorden', glyph:'plus'},
      {path:'/settings', label:'Instellingen', glyph:'cog'}
    ];
    this.subscription = this.router.events.subscribe(event => this.url = event.url);
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/auth/signin']);
  }

  getUserName() {
    return this.authService.getUserName();
  }

  ngOnDestroy() {
    // prevent memory leak when component is destroyed
    this.subscription.unsubscribe();
  }
}
