import {Component, Input} from '@angular/core';
import {FormControl} from '@angular/forms';
import {ValidationService} from '../../services/validation.service';

@Component({
  selector: 'field-messages',
  template: `<div class="text-danger" *ngIf="errorMessage !== null">{{errorMessage}}</div>`
})
export class FieldMessages {
  @Input() control: FormControl;
  @Input() label: string = 'Field';

  get errorMessage(): string {
    for (let propertyName in this.control.errors) {
      if (this.control.errors.hasOwnProperty(propertyName) && this.control.touched) {
        return ValidationService.getValidatorErrorMessage(this.label, propertyName, this.control.errors[propertyName]);
      }
    }
    return null;
  }
}
