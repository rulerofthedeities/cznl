import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription}   from 'rxjs/Subscription';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'menu',
  template: `
    <div class="small text-right user">{{getUserName()}}</div>
    <nav role="navigation" class="navbar navbar-inverse">
      <ul class="nav navbar-nav">
        <li 
          *ngFor="let route of routes"
          routerLinkActive="active">
          <a [routerLink]="[route.path]">
            <span 
              class="glyphicon glyphicon-{{route.glyph}}" 
              aria-hidden="true">
            </span>
            {{route.label}}
          </a>
        </li>
      </ul>
      <ul class="nav navbar-nav navbar-right loginout">
        <li *ngIf="!isLoggedIn()" routerLinkActive="active">
          <a routerLink="auth" class="item">Login</a>
        </li>
        <li *ngIf="isLoggedIn()" routerLinkActive="active">
          <a (click)="onLogout()" class="item">Logout</a>
        </li>
      </ul>
    </nav>
  `,
  styles:[`
    .loginout {cursor: pointer;}
    .user {
      font-style: italic;
      color:DarkGrey
    }
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
