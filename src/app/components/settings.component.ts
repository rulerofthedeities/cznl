import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AllSettings} from '../models/settings.model';
import {SettingsService} from '../services/settings.service';
import {AuthService} from '../services/auth.service';
import {ErrorService} from '../services/error.service';
import 'rxjs/add/operator/takeWhile';

@Component({
  templateUrl: './settings.component.html'
})

export class AppSettingsComponent implements OnInit, OnDestroy {
  testLength: number[];
  directions: Object[];
  settings: AllSettings;
  isReady = false;
  isSubmitted = false;
  componentActive = true;

  constructor (
    private authService: AuthService,
    private settingsService: SettingsService,
    private route: ActivatedRoute,
    private errorService: ErrorService
  ) {}

  ngOnInit() {
    // access required for menu
    if (!this.authService.getUserAccess()) {
      this.authService.setUserAccess(this.route.snapshot.data['access']);
    }
    this.isReady = false;
    this.testLength = [5, 10, 20, 25, 50, 100];
    this.directions = [
      {label: 'Nederlands -> Tsjechisch', val: 'nlcz'},
      {label: 'Tsjechisch -> Nederlands', val: 'cznl'}
    ];
    this.getSettings();
  }

  onModified() {
    this.isSubmitted = false;
  }

  onSubmit() {
    this.settingsService.setAppSettings(this.settings)
    .takeWhile(() => this.componentActive)
    .subscribe(
      settings => { ; },
      error => this.errorService.handleError(error)
    );
    this.isSubmitted = true;
  }

  getSettings() {
    this.settingsService
    .getAppSettings()
    .takeWhile(() => this.componentActive)
    .subscribe(
      settings => {
        if (settings) {
          this.settings = settings.all;
        } else {
          this.settings = {
            maxWords: 25,
            lanDir: 'nlcz',
            showPronoun: false,
            showColors: true
          };
        }
        this.isReady = true;
      },
      error => this.errorService.handleError(error)
    );
  }

  ngOnDestroy() {
    this.componentActive = false;
  }
}
