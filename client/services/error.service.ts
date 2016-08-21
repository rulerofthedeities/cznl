import {EventEmitter} from '@angular/core';
import {Error} from '../models/error.model';

export class ErrorService {
  errorOccurred = new EventEmitter<Error>();

  handleError(error: any) {
    const errMsg = JSON.parse(error._body);
    const errorData = new Error(errMsg.title, errMsg.error.message);
    this.errorOccurred.emit(errorData);
  }
}
