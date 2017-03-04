import {Component} from '@angular/core';
import {AuthService} from '../../services/auth.service';

@Component({
  template: `
  <router-outlet></router-outlet>
  `
})

export class AuthMenuComponent {
  constructor (
    private authService: AuthService
  ) {}

  isLoggedIn() {
      return this.authService.isLoggedIn();
  }
}
