import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Http} from '@angular/http';
import {AuthService } from '../../services/auth.service';
import {ErrorService} from '../../services/error.service';
import {ValidationService} from '../../services/validation.service';
import {User} from '../../models/user.model';
import 'rxjs/add/operator/takeWhile';

@Component({
  templateUrl: 'sign-up.component.html',
  styles: [`
    div.signin {
      float:right;
      font-size: 85%;
      position: relative; 
      top:-10px;
    }
    div.signin a {
      color:snow;
    }
  `]
})

export class SignUpComponent implements OnInit, OnDestroy {
  userForm: FormGroup;
  user: User;
  mailInUse: boolean;
  userInUse: boolean;
  componentActive = true;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private errorService: ErrorService,
    private http: Http
  ) {}

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.userForm = this.formBuilder.group({
      'userName': ['', Validators.required, ValidationService.checkUniqueUserName(this.http)],
      'email': ['', [Validators.required, ValidationService.emailValidator], ValidationService.checkUniqueEmail(this.http)],
      'password': ['', [Validators.required, ValidationService.passwordValidator]]
    });
  }

  onSubmitForm(user: User) {
    if (this.userForm.valid) {
      this.authService
      .signup(user)
      .takeWhile(() => this.componentActive)
      .subscribe(
        data => {
          this.authService
          .signin(user)
          .takeWhile(() => this.componentActive)
          .subscribe(
            signInData => this.authService.signedIn(signInData),
            error => this.errorService.handleError(error)
          );
        },
        error => this.errorService.handleError(error)
      );
    }
  }

  ngOnDestroy() {
    this.componentActive = false;
  }
}
