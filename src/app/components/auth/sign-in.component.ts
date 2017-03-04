import {Component, OnInit, OnDestroy} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {ErrorService} from '../../services/error.service';
import {User} from '../../models/user.model';
import 'rxjs/add/operator/takeWhile';

@Component({
  templateUrl: 'sign-in.component.html'
})

export class SignInComponent implements OnInit, OnDestroy {
  user: User;
  componentActive = true;

  constructor(
    private authService: AuthService,
    private errorService: ErrorService
  ) {}

  ngOnInit() {
    this.user = new User('', '');
  }

  onSubmit(user: User) {
    this.authService
    .signin(user)
    .takeWhile(() => this.componentActive)
    .subscribe(
      data => this.authService.signedIn(data),
      error => this.errorService.handleError(error)
    );
  }

  ngOnDestroy() {
    this.componentActive = false;
  }
}
