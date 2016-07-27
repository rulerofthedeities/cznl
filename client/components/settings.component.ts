import {Component, OnInit} from '@angular/core';
import {Settings} from '../model/settings.model';
import {SettingsService} from '../services/settings.service';

@Component({
  selector: 'settings',
  templateUrl: 'client/components/settings.component.html'
})

export class AppSettings implements OnInit {
  testLength: number[];
  directions: Object[];
  settings: Settings;
  isReady = true;
  isSubmitted = false;

  constructor (private settingsService: SettingsService) {}

  ngOnInit() {
    this.testLength = [10, 25, 50, 100];
    this.directions = [
      {label:'Nederlands -> Tsjechisch', val:'nlcz'},
      {label:'Tsjechisch -> Nederlands', val:'cznl'}
    ];
    this.settings = {
      maxWords: 25,
      lanDir: 'nlcz'
    };
    this.isReady = true;
  }

  onSubmit() {
    this.settingsService.setSettings(this.settings);
    this.isSubmitted = true;
  }

}
