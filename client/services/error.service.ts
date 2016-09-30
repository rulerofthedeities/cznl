import {EventEmitter} from '@angular/core';
import {Error} from '../models/error.model';

export class ErrorService {
  errorOccurred = new EventEmitter<Error>();

  handleError(error: any) {
    const title = error? error.title : 'Unknown Error';
    const message = error && error.error ? error.error.message : 'Unknown Message';

    const errorData = new Error(title, message);
    this.errorOccurred.emit(errorData);
  }
}
