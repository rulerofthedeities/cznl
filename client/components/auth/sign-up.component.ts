import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Http} from '@angular/http';
import {AuthService } from '../../services/auth.service';
import {ErrorService} from '../../services/error.service';
import {ValidationService} from '../../services/validation.service';
import {User} from '../../models/user.model';
import 'rxjs/add/operator/takeWhile';

@Component({
  template: `
    <div id="signupbox" style="margin-top:50px" class="col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2">
      <div class="panel panel-primary">
        <div class="panel-heading">
          <div class="panel-title">Registreren</div>
          <div class="signin">
            <a routerLink="/auth/signin">Aanmelden</a>
          </div>
        </div>  
        <div class="panel-body bg-info">
          <form id="signupform"
            [formGroup]="userForm"
            class="form-horizontal"
            role="form">

            <div class="form-group">
              <label for="username" class="col-md-3 control-label">Gebruikersnaam</label>
              <div class="col-md-9">
                <input 
                  type="text" 
                  class="form-control"
                  name="username" 
                  placeholder="Uw gebruikersnaam"
                  formControlName="userName" 
                  minlength="5" 
                  maxlength="16">
                <field-messages 
                  [control]="userForm.controls.userName"
                  [label]="'Gebruikersnaam'">
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
                  placeholder="Emailadres"
                  formControlName="email">
                <field-messages 
                  [control]="userForm.controls.email"
                  [label]="'Email'">
                </field-messages>
              </div>
            </div>

            <div class="form-group">
              <label for="password" class="col-md-3 control-label">Wachtwoord</label>
              <div class="col-md-9">
                <input id="password"
                  type="password" 
                  class="form-control" 
                  name="passwd" 
                  placeholder="Wachtwoord"
                  formControlName="password" >
                <field-messages 
                  [control]="userForm.controls.password"
                  [label]="'Wachtwoord'">
                </field-messages>
              </div>
            </div>

            <div class="form-group">                                
              <div class="col-md-offset-3 col-md-9">
                <button type="button" 
                  class="btn btn-success"
                  [disabled]="!userForm.valid"
                  (click)="onSubmitForm(userForm.value)">
                  <i class="glyphicon glyphicon-hand-right"></i> &nbsp;&nbsp; Registreer
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

export class SignUp implements OnInit, OnDestroy {
  userForm: FormGroup;
  user: User;
  mailInUse: boolean;
  userInUse: boolean;
  componentActive: boolean = true;

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
            data => this.authService.signedIn(data),
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
