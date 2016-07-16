import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'card-score',
  template: `
  FINISHED
  score: {{scoreDisplay}} ({{percDisplay}}%)`
})

export class CardScore implements OnInit {
  @Input() correct;
  @Input() total;
  scoreDisplay: string;
  percDisplay: string;

  ngOnInit() {
    this.scoreDisplay = this.correct + '/' + this.total;
    this.percDisplay = Math.round(this.correct / this.total * 100).toString();
  }
}
