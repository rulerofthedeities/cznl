import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ProgressService} from '../services/progress.service';
import {ErrorService} from '../services/error.service';
import {AuthService} from '../services/auth.service';
import {UtilsService} from '../services/utils.service';
import {ProgressStats, CalendarDay} from '../models/stats.model';
import 'rxjs/add/operator/takeWhile';
import * as moment from 'moment';

@Component({
  templateUrl: './progress.component.html',
  styleUrls: [`./progress.component.css`]
})

export class ProgressComponent implements OnInit, OnDestroy {
  componentActive = true;
  stats: ProgressStats[];
  cols: number[];
  rows: number[];
  monthName: string;
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
    // access required for menu
    if (!this.authService.getUserAccess()) {
      this.authService.setUserAccess(this.route.snapshot.data['access']);
    }
    this.fetchStats();
  }

  buildCalendar() {
    this.cols = new Array(7).fill(1).map((x, i) => i);
    this.rows = new Array(5).fill(1).map((x, i) => i);
    this.dayNames = this.utilsService.getDaysNames('short');

    // get  first day of the month
    const date = new Date(),
          y = date.getFullYear(),
          m = date.getMonth(),
          firstDay = new Date(y, m, 1);
    this.monthName = this.utilsService.getMonthNames()[date.getMonth()] + ' ' + moment(date).format('YYYY');
    // get first monday of that week
    const firstMonday = moment(firstDay).startOf('isoWeek');
    let calendarDay = moment(firstMonday);
    // get all days for the calendar
    for (let indx = 0; indx < 35; indx++) {
      this.calendarDays[indx] = {
        dt: calendarDay.toDate(),
        day: calendarDay.format('DD'),
        currentMonth: calendarDay.month() === moment(firstDay).month(),
        stats: this.stats && this.stats[calendarDay.format('YYYY-MM-DD')] ? this.stats[calendarDay.format('YYYY-MM-DD')] : ''
      };
      calendarDay = calendarDay.add(1, 'd');
    }
  }

  fetchStats() {
    this.progressService
    .getProgressStats()
    .takeWhile(() => this.componentActive)
    .subscribe(
      stats => {
        const arr: Array<ProgressStats> = (<any>Object).values(stats),
              dailyStats: ProgressStats[] = [];
        arr.forEach(day => {
          dailyStats[day.dt.toString()] = day;
        });
        this.stats = dailyStats;
        this.buildCalendar();
      },
      error => this.errorService.handleError(error)
    );
  }

  isInThePast(indx: number): boolean {
    const date = new Date();
    return moment(date).isAfter(this.calendarDays[indx].dt, 'day');
  }

  isToday(indx: number): boolean {
    const date = new Date();
    return moment(date).isSame(this.calendarDays[indx].dt, 'day');
  }

  ngOnDestroy() {
    this.componentActive = false;
  }
}
