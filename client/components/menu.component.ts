import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {TestService} from '../services/test.service';
import {ErrorService} from '../services/error.service';
import {Access} from '../models/access.model';
import 'rxjs/add/operator/takeWhile';

@Component({
  selector: 'menu-bar',
  template: `
  <div class="row">
    <div class="small text-right user" 
      *ngIf="isLoggedIn()"
      (click)="getUserAccess()">
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
          <a [routerLink]="route.path" *ngIf="showMenuItem(route.role)" (click)="stopTest()">
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
          <a routerLink="auth" class="item"><span class="fa fa-unlock"></span> Aanmelden</a>
        </li>
        <li *ngIf="isLoggedIn()" routerLinkActive="active">
          <a (click)="onLogout()" class="item"><span class="fa fa-lock"></span> Afmelden</a>
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
    .navbar-inverse .navbar-nav>.active>a {
      background-color:inherit;
      margin-right: 6px;
    }
  `]
})

export class Menu implements OnInit, OnDestroy {
  url: string;
  routes: Object[];
  access = new Access();
  showAccess: boolean = false;
  componentActive: boolean = true;

  constructor(
    private authService: AuthService,
    private errorService: ErrorService,
    private testService: TestService,
    private router: Router
  ) {}

  ngOnInit() {
    this.routes = [
      {path:'/tests', label:'Oefeningen', glyph:'list-alt'},
      {path:'/words', label:'Woorden', glyph:'plus', role: 'EditWords'},
      {path:'/settings', label:'Instellingen', glyph:'cog'}
    ];
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

  showMenuItem(role): boolean {
    if (!role || this.authService.hasRole(role)) {
      return true;
    } else {
      return false;
    }
  }

  getUserAccess() {
    this.showAccess = !this.showAccess;
    if (this.showAccess) {
      this.access = this.authService.getUserAccess();
      if (!this.access) {
        this.authService
        .fetchUserAccess()
        .takeWhile(() => this.componentActive)
        .subscribe(
          access => {
            this.authService.setUserAccess(access);
            this.access = access;
          },
          error => this.errorService.handleError(error)
        );
      }
    }
  }

  stopTest() {
    this.testService.doStop();
  }

  ngOnDestroy() {
    this.componentActive = false;
  }
}
