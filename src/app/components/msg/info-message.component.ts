import {Component} from '@angular/core';

@Component({
  selector: 'info-msg',
  template: `
    <p class="bg-success">
      <ng-content></ng-content>
    </p>
  `
})

export class InfoMessage { }
