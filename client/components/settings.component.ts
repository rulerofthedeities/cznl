import {Component, OnInit} from '@angular/core';
import {Settings} from '../models/settings.model';
import {SettingsService} from '../services/settings.service';

@Component({
  templateUrl: 'client/components/settings.component.html'
})

export class AppSettings implements OnInit {
  testLength: number[];
  directions: Object[];
  settings: Settings;
  isReady = false;
  isSubmitted = false;

  constructor (private settingsService: SettingsService) {}

  ngOnInit() {
    this.isReady = false;
    this.testLength = [10, 25, 50, 100];
    this.directions = [
      {label:'Nederlands -> Tsjechisch', val:'nlcz'},
      {label:'Tsjechisch -> Nederlands', val:'cznl'}
    ];
    this.settingsService.getAppSettings()
      .then(settings => {
        this.settings = settings;
        this.isReady = true;
      });
  }

  onSubmit() {
    this.settingsService.setAppSettings(this.settings);
    this.isSubmitted = true;
  }

}
