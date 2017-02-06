import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ProgressService} from '../services/progress.service';
import {ErrorService} from '../services/error.service';
import {AuthService} from '../services/auth.service';
import {UtilsService} from '../services/utils.service';
import {ProgressStats} from '../models/stats.model';
import 'rxjs/add/operator/takeWhile';
import * as moment from 'moment';

interface CalendarDay {
  day: string;
  currentMonth: boolean;
}

@Component({
  template: `
    <h1>Progress</h1>
    <div class="row days">
      <div *ngFor="let col of cols;" class="col-md-1">
        {{dayNames[col]}}
      </div>
      <div class="col-md-5">extra</div>
    </div>
    <div class="row" *ngFor="let row of rows">
      <div *ngFor="let col of cols;" class="col-md-1">
        <span [ngClass]="{'diffMonth': !calendarDays[row * 7 + col].currentMonth}">{{calendarDays[row * 7 + col].day}}</span>
      </div>
      <div class="col-md-5">extra</div>
    </div>
  `,
  styles: [`
    .diffMonth {
      color: #cccccc;
      font-style: italic;
    }
  `]
})

export class Progress implements OnInit, OnDestroy {
  componentActive: boolean = true;
  stats: ProgressStats;
  cols: number[];
  rows: number[];
  dayNames: string[];
  calendarDays: CalendarDay[] = [];

  constructor (
    private authService: AuthService,
    private route: ActivatedRoute,
    private progressService: ProgressService,
    private utilsService: UtilsService,
    private errorService: ErrorService
  ) {}

  ngOnInit() {
    //access required for menu
    if (!this.authService.getUserAccess()) {
      this.authService.setUserAccess(this.route.snapshot.data['access']);
    }
    this.buildCalendar();
    this.fetchStats();
  }

  buildCalendar() {
    this.cols = new Array(7).fill(1).map((x, i) => i);
    this.rows = new Array(5).fill(1).map((x, i) => i);
    this.dayNames = this.utilsService.getDaysNames('short');

    //get  first day of the month
    const date = new Date(),
        y = date.getFullYear(),
        m = date.getMonth();
    const firstDay = new Date(y, m, 1);
    //get first monday of that week
    const firstMonday = moment(firstDay).startOf('isoWeek');
    let calendarDay = moment(firstMonday);
    // get all days for the calendar
    for (let indx = 0; indx < 35; indx++) {
      this.calendarDays[indx] = {
        day: calendarDay.format('DD'),
        currentMonth: calendarDay.month() === moment(firstDay).month()
      };
      calendarDay = calendarDay.add(1, 'd');
    }
  }

  fetchStats() {
    let statsFetched = false;
    this.progressService
    .getProgressStats()
    .takeWhile(() => this.componentActive)
    .subscribe(
      stats => {
        this.stats = stats;
        statsFetched = true;
      },
      error => this.errorService.handleError(error)
    );
  }

  ngOnDestroy() {
    this.componentActive = false;
  }
}
