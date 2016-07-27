import {Injectable} from '@angular/core';
import {SETTINGS} from '../data/settings';
import {Settings} from '../model/settings.model';

@Injectable()
export class SettingsService {

  getSettings() {
    return Promise.resolve(SETTINGS);
  }

  setSettings(newSettings: Settings) {
    //todo save settings
  }
}
