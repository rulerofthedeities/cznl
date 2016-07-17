import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class RestartService {
  private restartSource = new Subject<string>();
  restart$ = this.restartSource.asObservable();

  restartTest() {
    this.restartSource.next('new test');
  }
}
