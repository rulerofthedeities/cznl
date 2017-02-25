import {Component, Input} from '@angular/core';
import {TestService} from '../services/test.service';

@Component({
  selector: 'test-buttons',
  template: `
    <div class="clearfix"></div>
    <div class="buttons">
      <button *ngIf="test"
        class="btn btn-success btn-lg btn-block"
        (click)="doStart('test')">
        <span class="fa" ngClass="{{getTestClass()}}"></span>
        {{getTestTitle()}}
      </button>
      <button *ngIf="practise"
        class="btn btn-success btn-lg btn-block"
        (click)="doStart('practise')">
        <span class="fa fa-play"></span>
        Oefen deze lijst
      </button>
      <button *ngIf="review"
        class="btn btn-success btn-lg btn-block"
        (click)="doStart('review')">
        <span class="fa fa-list-alt"></span>
        Overzicht
      </button>
      <button *ngIf="back"
        class="btn btn-success btn-lg btn-block"
        (click)="doStart('newtest')">
        <span class="fa fa-file-o"></span>
        Nieuwe lijst
      </button>
    </div>`,
  styles: [`
    .buttons {
      width:270px;
      margin-top:20px;
      margin-left:auto;
      margin-right:auto;
    }
  `]
})

export class TestButtons {
  @Input() back = false;
  @Input() test = false;
  @Input() review = false;
  @Input() practise = false;
  @Input() tpe = '';

  constructor(
    private testService: TestService
  ) {}

  doStart(tpe: string) {
    this.testService.doStart(tpe);
  }

  getTestTitle() {
    return this.tpe === 'test' ? 'Probeer opnieuw' : 'Test deze lijst';
  }

  getTestClass() {
    return this.tpe === 'test' ? 'fa-repeat' : 'fa-play';
  }
}
