import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'card-score',
  template: `
    <div class="card center-block text-center score">
      <h4>Test voltooid!</h4>
      <h2>Score: {{scoreDisplay}}</h2>
      <em>({{percDisplay}}%)</em>
      <test-buttons
        [test]="true"
        [review]="true"
        [back]="true"
        tpe="test"
      ></test-buttons>
    </div>`,
  styleUrls: ['client/components/cards/card.component.css']
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
