import {Injectable} from '@angular/core';
import {LEVELS} from '../data/filters';
import {TPES} from '../data/filters';
import {CATS} from '../data/filters';

@Injectable()
export class FilterService {
	getFilterOptions() {
		let FILTERS: Object = {
			'levels': LEVELS,
			'tpes': TPES,
      'cats': CATS};
		return Promise.resolve(FILTERS);
	}

}
