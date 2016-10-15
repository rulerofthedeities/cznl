import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AllSettings} from '../models/settings.model';
import {SettingsService} from '../services/settings.service';
import {AuthService} from '../services/auth.service';
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
    private authService: AuthService,
    private settingsService: SettingsService,
    private route: ActivatedRoute,
    private errorService: ErrorService
  ) {}

  ngOnInit() {
    //access required for menu
    if (!this.authService.getUserAccess()) {
      this.authService.setUserAccess(this.route.snapshot.data['access']);
    }
    this.isReady = false;
    this.testLength = [10, 25, 50, 100];
    this.directions = [
      {label:'Nederlands -> Tsjechisch', val:'nlcz'},
      {label:'Tsjechisch -> Nederlands', val:'cznl'}
    ];
    this.settingsService.getAppSettings().subscribe(
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
    this.settingsService.setAppSettings(this.settings).subscribe(
      settings => {;},
      error => this.errorService.handleError(error)
    );
    this.isSubmitted = true;
  }

}
