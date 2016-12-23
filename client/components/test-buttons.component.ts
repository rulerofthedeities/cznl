import {Component, Input} from '@angular/core';
import {TestService} from '../services/test.service';

@Component({
  selector:'test-buttons',
  template: `
    <div class="clearfix"></div>
    <div class="buttons">
      <button *ngIf="test"
        class="btn btn-success btn-lg btn-block"
        (click)="doStart('test')">
        <span class="fa fa-file-o"></span>
        Test deze lijst
      </button>
      <button *ngIf="review"
        class="btn btn-success btn-lg btn-block"
        (click)="doStart('review')">
        <span class="fa fa-list-alt"></span>
        Overzicht
      </button>
    </div>`,
  styles: [`
    .buttons {
      width:200px;
      margin-top: 12px;
      margin-left:auto;
      margin-right:auto;
    }
  `]
})

export class TestButtons {
  @Input() test: boolean = false;
  @Input() review: boolean = false;
  @Input() practise: boolean = false;

  constructor(
    private testService: TestService
  ) {}

  doStart(tpe: string) {
    this.testService.doStart(tpe);
  }
}
