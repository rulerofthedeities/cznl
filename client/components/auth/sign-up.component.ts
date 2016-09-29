import {Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {Http} from '@angular/http';
import {AuthService } from '../../services/auth.service';
import {ErrorService} from '../../services/error.service';
import {ValidationService} from '../../services/validation.service';
import {User} from '../../models/user.model';

@Component({
  template: `
    <div id="signupbox" style="margin-top:50px" class="col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2">
      <div class="panel panel-primary">
        <div class="panel-heading">
          <div class="panel-title">Sign Up</div>
          <div class="signin">
            <a routerLink="/auth/signin">Sign In</a>
          </div>
        </div>  
        <div class="panel-body bg-info">
          <form id="signupform"
            [formGroup]="userForm"
            class="form-horizontal"
            role="form">

            <div class="form-group">
              <label for="username" class="col-md-3 control-label">User Name</label>
              <div class="col-md-9">
                <input 
                  type="text" 
                  class="form-control"
                  name="username" 
                  placeholder="User Name"
                  formControlName="userName" 
                  minlength="5" 
                  maxlength="16">
                <field-messages 
                  [control]="userForm.controls.userName"
                  [label]="'User name'">
                </field-messages>
              </div>
            </div>

            <div class="form-group">
              <label for="email" class="col-md-3 control-label">Email</label>
              <div class="col-md-9">
                <input 
                  id="email"
                  type="text" 
                  class="form-control" 
                  name="email" 
                  placeholder="Email Address"
                  formControlName="email">
                <field-messages 
                  [control]="userForm.controls.email"
                  [label]="'Email'">
                </field-messages>
              </div>
            </div>

            <div class="form-group">
              <label for="password" class="col-md-3 control-label">Password</label>
              <div class="col-md-9">
                <input id="password"
                  type="password" 
                  class="form-control" 
                  name="passwd" 
                  placeholder="Password"
                  formControlName="password" >
                <field-messages 
                  [control]="userForm.controls.password"
                  [label]="'Password'">
                </field-messages>
              </div>
            </div>
                
            <div class="form-group">
              <label for="confirmPassword" class="col-md-3 control-label">Retype password</label>
              <div class="col-md-9">
                <input id="confirmPassword"
                  type="password" 
                  class="form-control" 
                  name="confirmPassword" 
                  placeholder="Password"
                  formControlName="confirmPassword" >
                <field-messages 
                  [control]="userForm.controls.confirmPassword"
                  [label]="'Password Confirmation'">
                </field-messages>
                <div class="text-danger" *ngIf="userForm.errors?.mismatchingPasswords">The passwords don't match</div>
              </div>
            </div>

            <div class="form-group">                                
              <div class="col-md-offset-3 col-md-9">
                <button type="button" 
                  class="btn btn-success"
                  [disabled]="!userForm.valid"
                  (click)="onSubmitForm(userForm.value)">
                  <i class="glyphicon glyphicon-hand-right"></i> &nbsp;&nbsp; Sign Up
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>`,
  styles:[`
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

export class SignUp implements OnInit {
  userForm: FormGroup;
  user: User;
  mailInUse: boolean;
  userInUse: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private errorService: ErrorService,
    private router: Router,
    private http: Http
  ) {}

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.userForm = this.formBuilder.group({
      'userName': ['', Validators.required, ValidationService.checkUniqueUserName(this.http)],
      'email': ['', [Validators.required, ValidationService.emailValidator], ValidationService.checkUniqueEmail(this.http)],
      'password': ['', [Validators.required, ValidationService.passwordValidator]],
      'confirmPassword': ['', Validators.required]
    }, {validator: ValidationService.equalPasswordsValidator});
  }

  onSubmitForm(user: User) {
    if (this.userForm.valid) {
      this.authService.signup(user).subscribe(
        data => {
          this.authService.signin(user).subscribe(
            data => {
              this.authService.storeUserData(data);
              this.router.navigateByUrl('/');
            },
            error => this.errorService.handleError(error)
          );
        },
        error => this.errorService.handleError(error)
      );
    }
  }
}
