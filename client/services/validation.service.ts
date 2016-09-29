import {FormControl, FormGroup, AbstractControl} from '@angular/forms';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {AuthService} from '../services/auth.service';

export class ValidationService {

  static getValidatorErrorMessage(label: string, validatorName: string, validatorValue?: any) {
    let config = {
      'required': label + ' is required',
      'invalidCreditCard': 'Is invalid credit card number',
      'invalidEmailAddress': 'Invalid email address. Format should be <i>john@doe.com</i>.',
      'minlength': `${label} must be at least ${validatorValue.requiredLength} characters long.`,
      'invalidPassword': `Invalid password. Password must be at least ${validatorValue.requiredLength}`
      + ` characters long, and contain a number.`,
      'usernameTaken': `This username is not available. Please choose another username.`,
      'emailTaken': `This email address is not available. Please choose another email.`,
      'recipientTaken': `This recipient already exists.`
      };

    return config[validatorName];
  }

  static creditCardValidator(control: FormControl): {[key: string]: any} {
    if (control.value.match(/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/)) {
      return null;
    } else {
      return {'invalidCreditCard': true};
    }
  }

  static emailValidator(control: FormControl): {[key: string]: any} {
    if (control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
      return null;
    } else {
      return {'invalidEmailAddress': true};
    }
  }

  static passwordValidator(control: FormControl): {[key: string]: any} {
    if (control.value.match(/^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,100}$/)) {
      return null;
    } else {
      return {'invalidPassword': {requiredLength:6}};
    }
  }

  static equalPasswordsValidator(group: FormGroup): {[key: string]: any} {
    if (group.controls['password'].value === group.controls['confirmPassword'].value) {
      return null;
    } else {
      return {'mismatchingPasswords': true};
    }
  }

  static checkUniqueUserName(http: Http) {
    return function(control) {
      return http.get('/api/user/check?user=' + control.value)
        .map(response => {
          if (response.json().obj === true) {
            return {'usernameTaken': true};
          } else {
            return null;
          }
        })
        .catch(error => Observable.throw(error.json()));
    };
  }

  static checkUniqueEmail(http: Http) {
    return function(control: AbstractControl) {
      return http.get('/api/user/check?mail=' + control.value)
        .map(response => {
          if (response.json().obj === true) {
            return {'emailTaken': true};
          } else {
            return null;
          }
        })
        .catch(error => Observable.throw(error.json()));
    };
  }

  static checkUniqueRecipient(http: Http, authService: AuthService, recipientId: string) {
    return function(control: AbstractControl) {
      const token = authService.getToken(),
            name = '&name=' + control.value,
            recipient = recipientId ? '&id=' + recipientId : '';
      return http.get('/api/recipients/check' + token + name + recipient)
        .map(response => {
          if (response.json().obj === true) {
            return {'recipientTaken': true};
          } else {
            return null;
          }
        })
        .catch(error => Observable.throw(error.json()));
    };
  }
}


