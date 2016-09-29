import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'logout',
  template: `
    <a (click)="onLogout()" class="item">Logout</a>
  `
})

export class LogOut {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/auth/signin']);
  }
}
