import {EventEmitter} from '@angular/core';
import {Error} from '../models/error.model';

export class ErrorService {
  errorOccurred = new EventEmitter<Error>();

  handleError(error: any) {
    console.log('Error:', error);
    var msg = 'unknown error message';
    var title = 'error';
    if (error && error.error) {
      msg = error.error.error || msg;
      title = error.title || title;
    }
    this.errorOccurred.emit(new Error(title, msg));
  }
}
