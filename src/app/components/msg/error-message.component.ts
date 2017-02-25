import {Component, OnInit, OnDestroy} from '@angular/core';
import {Error} from '../../models/error.model';
import {ErrorService} from '../../services/error.service';
import 'rxjs/add/operator/takeWhile';

@Component({
  selector: 'error-msg',
  template: `
    <div *ngIf="showError" class="text-danger">
      <h4 class="modal-title">{{errorData?.title}}</h4>
      <p>Foutmelding: {{errorData?.message}}</p>
    </div>`
})

export class ErrorMessage implements OnInit, OnDestroy {
  errorData: Error;
  showError = false;
  componentActive = true;

  constructor (private errorService: ErrorService) {}

  ngOnInit() {
    this.errorService.errorOccurred
    .takeWhile(() => this.componentActive)
    .subscribe(
      errorData => {
        this.errorData = errorData;
        this.showError = true;
      }
    );
  }

  onErrorHandled() {
     this.showError = false;
  }

  ngOnDestroy() {
    this.componentActive = false;
  }
}
