import {Filter} from './filters.model';

export interface Settings {
  _id: string;
  dt: Date;
  all: {
    maxWords: number;
    lanDir: string;
  };
  filter: Filter;
}
