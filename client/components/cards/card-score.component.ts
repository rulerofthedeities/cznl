import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {RestartService} from '../../services/restart.service';

@Component({
  selector: 'card-score',
  template: `
    <div class="card center-block text-center score">
      <h4>Test voltooid!</h4>
      <h2>Score: {{scoreDisplay}}</h2>
      <em>({{percDisplay}}%)</em>
      <div class="clearfix"></div>
      <div class="buttons">
        <button 
          class="btn btn-success btn-lg btn-block"
          (click)="doRestart()">
          <span class="fa fa-repeat"></span>
          Probeer opnieuw
        </button>
        <button 
          class="btn btn-success btn-lg btn-block"
          (click)="doNewTest()">
          <span class="fa fa-file-o"></span>
          Nieuwe test
        </button>
        <button 
          class="btn btn-success btn-lg btn-block"
          (click)="doReview()">
          <span class="fa fa-list-alt"></span>
          Herziening
        </button>
      </div>
    </div>`,
  styleUrls: ['client/components/cards/card.component.css']
})

export class CardScore implements OnInit {
  @Input() correct;
  @Input() total;
  @Output() restart = new EventEmitter();
  @Output() review = new EventEmitter();
  scoreDisplay: string;
  percDisplay: string;

  constructor (private restartService: RestartService) {}

  ngOnInit() {
    this.scoreDisplay = this.correct + '/' + this.total;
    this.percDisplay = Math.round(this.correct / this.total * 100).toString();
  }

  doRestart() {
    this.restart.emit(true);
  }

  doNewTest() {
    this.restartService.restartTest();
  }

  doReview() {
    this.review.emit(true);
  }
}
