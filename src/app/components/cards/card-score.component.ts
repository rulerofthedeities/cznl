import {Component, Input, OnInit} from '@angular/core';
import {TimeService} from '../../services/time.service';

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
        [practise]="true"
        [back]="true"
        tpe="test"
      ></test-buttons>
      <em class="duration">Duur: {{timeDisplay}}</em>
    </div>`,
  styleUrls: ['./card.component.css']
})

export class CardScoreComponent implements OnInit {
  @Input() correct;
  @Input() total;
  scoreDisplay: string;
  percDisplay: string;
  timeDisplay: string;

  constructor(private timeService: TimeService) {}

  ngOnInit() {
    this.scoreDisplay = this.correct + '/' + this.total;
    this.percDisplay = Math.round(this.correct / this.total * 100).toString();
    this.timeDisplay = this.timeService.getTimeElapsedTime();
  }
}
