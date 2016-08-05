import {Injectable} from '@angular/core';
import {LEVELS} from '../data/filters';
import {TPES} from '../data/filters';
import {GENUS} from '../data/filters';
import {CATS} from '../data/filters';

@Injectable()
export class FilterService {
	getFilterOptions() {
		const FILTERS: Object = {
			'levels': LEVELS,
			'tpes': TPES,
      'genus': GENUS,
      'cats': CATS};
		return Promise.resolve(FILTERS);
	}

}
