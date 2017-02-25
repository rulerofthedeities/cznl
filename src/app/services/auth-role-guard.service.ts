import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {AuthService} from './auth.service';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class AuthRoleGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|boolean {
    return this.authService.fetchUserAccess()
      .map(
        access => {
          this.authService.setUserAccess(access);
          if (state.url === '/words' && !this.authService.hasRole('EditWords')) {
            this.router.navigate(['/tests']);
            return false;
          } else {
            return true;
          }
        })
      .catch(error => Observable.throw(error));
  }
}
