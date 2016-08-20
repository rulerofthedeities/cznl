import {Component, OnInit} from '@angular/core';
import {Error} from '../../models/error.model';
import {ErrorService} from '../../services/error.service';

@Component({
  selector:'error-msg',
  template: `
    <p class="text-danger text-center" *ngIf="showError">
      <strong>Error: {{errorData?.message}}</strong>
    </p>`
})

export class ErrorMessage implements OnInit {
  errorData: Error;
  showError = false;

  constructor (private errorService: ErrorService) {}

  ngOnInit() {
    this.errorService.errorOccurred.subscribe(
      errorData => {
        this.errorData = errorData;
        this.showError = true;
      }
    );
  }

  onErrorHandled() {
     this.showError = false;
  }
}
