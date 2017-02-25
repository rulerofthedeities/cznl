import {Component, OnInit, OnDestroy} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {ErrorService} from '../../services/error.service';
import {User} from '../../models/user.model';
import 'rxjs/add/operator/takeWhile';

@Component({
  template: `
    <div id="loginbox" style="margin-top:50px;" class="col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2">                    
      <div class="panel panel-primary">
        <div class="panel-heading">
          <div class="panel-title">Aanmelden</div>
          <div *ngIf="false" style="float:right; font-size: 80%; position: relative; top:-10px">
            <a href="#">Forgot password?</a>
          </div>
        </div>     
        <div style="padding-top:30px" class="panel-body bg-info">
          <form #f="ngForm" 
            id="loginform" 
            class="form-horizontal" 
            role="form" 
            novalidate 
            (ngSubmit)="onSubmit(f.value, f.valid)">
            
            <div class="input-group">
              <span class="input-group-addon">
                <i class="glyphicon glyphicon-user"></i>
              </span>
              <input id="email" 
                type="text" 
                class="form-control" 
                name="email"
                placeholder="Email address"
                [ngModel]="user.email"
                validateEmail
                required  
                #email="ngModel">                                       
            </div>
                
            <small class="text-danger" [hidden]="!email?.errors?.required || (email?.pristine && !f.submitted)">
              Email is required.
            </small>
            <small class="text-danger" [hidden]="!email?.errors?.invalidMail || (email?.pristine && !f.submitted)">
              Email format should be <i>john@doe.com</i>.
            </small> 

            <div style="margin-top: 25px" class="input-group">
              <span class="input-group-addon">
                <i class="glyphicon glyphicon-lock"></i>
              </span>
              <input id="login-password" 
                type="password" 
                class="form-control" 
                name="password" 
                placeholder="Password"
                [ngModel]="user.password" 
                required 
                #password="ngModel">
            </div>
                
            <small class="text-danger" [hidden]="!password?.errors?.required || (password?.pristine && !f.submitted)">
              Password is required
            </small>

            <div style="margin-top: 25px" class="input-group" *ngIf="false">
              <div class="checkbox">
                <label>
                  <input id="login-remember" type="checkbox" name="remember" value="1"> Remember me
                </label>
              </div>
            </div>

            <div style="margin-top:25px" class="form-group">
                <div class="col-sm-12 controls">
                  <button type="submit"
                    class="btn btn-success"
                    [disabled]="!f.valid">
                    Aanmelden
                  </button>
                </div>
            </div>

            <error-msg></error-msg>

            <div class="form-group">
              <div class="col-md-12 control">
                <div style="border-top: 1px solid#888; padding-top:15px; font-size:85%" >
                  Heeft u nog geen account?
                    <a routerLink="/auth/signup">Registreer dan hier</a>
                </div>
              </div>
            </div>    
          </form>     
        </div>                     
      </div>
    </div>
  `
})

export class SignIn implements OnInit, OnDestroy {
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
