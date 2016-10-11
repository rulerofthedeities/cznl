import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription}   from 'rxjs/Subscription';
import {AuthService} from '../services/auth.service';
import {ErrorService} from '../services/error.service';
import {Access} from '../models/access.model';

@Component({
  selector: 'menu-bar',
  template: `
  <div class="row">
    <div class="small text-right user" 
      *ngIf="isLoggedIn()"
      (click)="getAccess()">
      <span class="fa" [ngClass]="{'fa-chevron-right':!showAccess, 'fa-chevron-down':showAccess}"></span>
      {{getUserName()}}
      <div *ngIf="showAccess" id="accesswrapper">
        <ul class="list-unstyled">
          <li><strong>level</strong>: {{access?.level | levelName}}</li>
          <li><strong>roles</strong>: {{access?.roles?.length > 0 ? access?.roles.join(', ') : 'no roles'}}</li>
        </ul>
      </div>
    </div>
    <nav role="navigation" class="navbar navbar-inverse">
      <ul class="nav navbar-nav">
        <li 
          *ngFor="let route of routes"
          routerLinkActive="active">
          <a [routerLink]="[route.path]" *ngIf="!route.protected || isLoggedIn()">
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
  </div>
  `,
  styles:[`
    .loginout {cursor: pointer;}
    .user {
      font-style: italic;
      color:DarkGrey;
      cursor: pointer;
    }
    .nav li a {
      line-height: 50px;
      height: 50px;
      font-size: 1.5em;
      padding-top: 0;
    }
    #accesswrapper {
      color:white;
      z-index:3;
      position: absolute;
      width:120px;
      display: inline;
    }
    #accesswrapper > ul {
      background-color:white;
      border: 1px solid black;
      color:black;
      position: relative;
      left:-120px;
      top:16px;
      padding:6px;
      border-radius: 5px;
      text-align:left;
    }
  `]
})

export class Menu implements OnInit, OnDestroy {
  subscription: Subscription;
  url: string;
  routes: Object[];
  access = new Access();
  showAccess = false;

  constructor(
    private authService: AuthService,
    private errorService: ErrorService,
    private router: Router
  ) {}

  ngOnInit() {
    this.routes = [
      {path:'/tests', label:'Oefeningen', glyph:'list-alt', protected: false},
      {path:'/words', label:'Woorden', glyph:'plus', protected: true},
      {path:'/settings', label:'Instellingen', glyph:'cog', protected: false}
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

  getAccess() {
    this.showAccess = !this.showAccess;
    if (this.showAccess) {
      this.authService.getAccessLevel().then(
        access => {
          if (access) {
            this.access = new Access(access.level, access.roles);
          }
        },
        error => this.errorService.handleError(error)
      );
    }
  }

  ngOnDestroy() {
    // prevent memory leak when component is destroyed
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
