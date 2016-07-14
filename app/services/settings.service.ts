import {Injectable} from '@angular/core';
import {SETTINGS} from '../data/settings';

@Injectable()
export class SettingsService {
  getSettings() {
    return Promise.resolve(SETTINGS);
  }
}
