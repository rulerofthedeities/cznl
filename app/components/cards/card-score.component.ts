import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';

@Component({
  selector: 'card-score',
  template: `
    <div class="card center-block text-center score">
      <h4>Test Completed!</h4>
      <h2>Score: {{scoreDisplay}}</h2>
      <em>({{percDisplay}}%)</em>
      <div class="clearfix"></div>
      <button 
        class="btn btn-success"
        (click)="doRestart()">
        Probeer opnieuw
      </button>
    </div>`,
  styleUrls: ['app/components/cards/card.component.css']
})

export class CardScore implements OnInit {
  @Input() correct;
  @Input() total;
  @Output() restart = new EventEmitter();
  scoreDisplay: string;
  percDisplay: string;

  ngOnInit() {
    this.scoreDisplay = this.correct + '/' + this.total;
    this.percDisplay = Math.round(this.correct / this.total * 100).toString();
  }

  doRestart() {
    this.restart.emit(true);
  }
}
