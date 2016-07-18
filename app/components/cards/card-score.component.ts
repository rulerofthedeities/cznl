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
          class="btn btn-success btn-block"
          (click)="doRestart()">
          Probeer opnieuw
        </button>
        <button 
          class="btn btn-success btn-block"
          (click)="doNewTest()">
          Nieuwe test
        </button>
      </div>
    </div>`,
  styleUrls: ['app/components/cards/card.component.css']
})

export class CardScore implements OnInit {
  @Input() correct;
  @Input() total;
  @Output() restart = new EventEmitter();
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
}
