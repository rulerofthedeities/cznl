import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ProgressService} from '../services/progress.service';
import {ErrorService} from '../services/error.service';
import {AuthService} from '../services/auth.service';
import {UtilsService} from '../services/utils.service';
import {ProgressStats} from '../models/stats.model';
import 'rxjs/add/operator/takeWhile';
import * as moment from 'moment';

@Component({
  template: `
    <h1>Progress</h1>
    <div class="row month">
      <div *ngFor="let col of cols;" class="col-md-1">
        {{days[col]}}
      </div>
      <div class="col-md-5">extra</div>
    </div>
  `
})

export class Progress implements OnInit, OnDestroy {
  componentActive: boolean = true;
  stats: ProgressStats;
  cols: number[];
  days: string[];

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
    this.days = this.utilsService.getDaysNames('short');

    let date = new Date(),
        y = date.getFullYear(),
        m = date.getMonth();
    let firstDay = new Date(y, m, 1);
    console.log('first day of month', firstDay);
  }

  fetchStats() {
    let statsFetched = false;
    this.progressService
    .getProgressStats()
    .takeWhile(() => this.componentActive)
    .subscribe(
      stats => {
        console.log('fetched stats', stats);
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
