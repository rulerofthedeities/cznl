import {Component, OnInit} from '@angular/core';
import {AllSettings} from '../models/settings.model';
import {SettingsService} from '../services/settings.service';
import {ErrorService} from '../services/error.service';

@Component({
  templateUrl: 'client/components/settings.component.html'
})

export class AppSettings implements OnInit {
  testLength: number[];
  directions: Object[];
  settings: AllSettings;
  isReady = false;
  isSubmitted = false;

  constructor (
    private settingsService: SettingsService,
    private errorService: ErrorService
  ) {}

  ngOnInit() {
    this.isReady = false;
    this.testLength = [10, 25, 50, 100];
    this.directions = [
      {label:'Nederlands -> Tsjechisch', val:'nlcz'},
      {label:'Tsjechisch -> Nederlands', val:'cznl'}
    ];
    this.settingsService.getAppSettings().then(
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

  onModified() {
    this.isSubmitted = false;
  }

  onSubmit() {
    this.settingsService.setAppSettings(this.settings).then(
      settings => {;},
      error => this.errorService.handleError(error)
    );
    this.isSubmitted = true;
  }

}
