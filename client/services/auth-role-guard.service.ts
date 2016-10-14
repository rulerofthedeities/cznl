import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {AuthService} from './auth.service';
import {Router} from '@angular/router';

@Injectable()
export class AuthRoleGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (state.url === '/words' && !this.authService.hasRole('EditWords')) {
      return false;
    } else {
      return true;
    }
  }
}
