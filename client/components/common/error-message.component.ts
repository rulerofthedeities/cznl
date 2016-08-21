import {Component, OnInit} from '@angular/core';
import {Error} from '../../models/error.model';
import {ErrorService} from '../../services/error.service';

@Component({
  selector:'error-msg',
  template: `
  <div class="modal" tabindex="-1" role="dialog" *ngIf="showError">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" aria-label="Close" (click)="onErrorHandled()"><span aria-hidden="true">&times;</span></button>
          <h4 class="modal-title">{{errorData?.title}}</h4>
        </div>
        <div class="modal-body">
          <p class="text-danger text-center">
            <strong>Error: {{errorData?.message}}</strong>
          </p>
        </div>
        <div class="modal-footer">
            <button 
              type="button" 
              class="btn btn-default" 
              (click)="onErrorHandled()">
              Close
            </button>
        </div>
      </div>
    </div>
    `
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
