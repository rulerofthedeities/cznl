import {Injectable, EventEmitter} from '@angular/core';

@Injectable()
export class TestService {
  //Restart a test, practise or review
  start = new EventEmitter<string>();
  stop = new EventEmitter();

  doStart(tpe: string) {
    this.start.emit(tpe);
  }

  doStop() {
    this.stop.emit();
  }

}
