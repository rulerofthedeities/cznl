import {Component, Input, OnChanges} from '@angular/core';
import {Total} from '../../models/word.model';

type Bar = {lenCorrect: number, lenIncorrect: number};

@Component({
  selector: 'score-bar',
  template: `
    <div *ngIf="total.correct + total.incorrect > 0">
      <div class="scorebar" width="100%" [tooltip]="tooltip" tooltipPlacement="top">
        <div class="correct" [ngStyle]="{width:bar.lenCorrect + '%'}"></div>
        <div class="incorrect" [ngStyle]="{width:bar.lenIncorrect + '%'}"></div>
      </div>
    </div>
    `,
  styles: [`
    .scorebar {
      border: 1px solid #ccc;
      height: 3px;
      margin-top:6px;
    }
    .scorebar .correct {
      background-color: #009900;
      height: 3px;
      float: left;
    }
    .scorebar .incorrect {
      background-color: #ee0000;
      height: 3px;
      float: left;
    }
  `]
})

export class ScoreBar implements OnChanges {
  @Input() total: Total;
  bar: Bar;
  tooltip: string;

  ngOnChanges() {
    let lenCorrect = Math.round((this.total.correct / (this.total.correct + this.total.incorrect)) * 100);
    this.bar = {
      lenCorrect,
      lenIncorrect: 100 - lenCorrect
    };
    this.tooltip = `${this.total.correct.toString()} / ${(this.total.correct + this.total.incorrect).toString()}`;
  }

}
