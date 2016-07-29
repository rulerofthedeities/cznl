import {Filter} from './filters.model';

export interface AllSettings {
    maxWords: number;
    lanDir: string;
    showPronoun: boolean;
}

export interface Settings {
  _id: string;
  dt: Date;
  all: AllSettings;
  filter: Filter;
}
