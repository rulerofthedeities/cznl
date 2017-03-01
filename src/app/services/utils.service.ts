import {FilterOption} from '../models/filters.model';

export class UtilsService {
  // https://basarat.gitbooks.io/algorithms/content/docs/shuffling.html
  shuffle<T>(array: T[]): T[] {
    // if it's 1 or 0 items, just return
    if (!array || array.length <= 1) { return array; }
    // For each index in array
    for (let i = 0; i < array.length; i++) {
      // choose a random not-yet-placed item to place there
      // must be an item AFTER the current item, because the stuff
      // before has all already been placed
      const randomChoiceIndex = this.getRandom(i, array.length - 1);
      // place the random choice in the spot by swapping
      [array[i], array[randomChoiceIndex]] = [array[randomChoiceIndex], array[i]];
    }

    return array;
  }

  getDaysNames(tpe: string = 'long'): string[] {
    const days = {
      long: [
        'maandag',
        'dinsdag',
        'woensdag',
        'donderdag',
        'vrijdag',
        'zaterdag',
        'zondag'
      ],
      short: [
        'ma',
        'di',
        'wo',
        'do',
        'vr',
        'za',
        'zo'
      ]
    };

    return days[tpe];
  }

  getMonthNames(): string[] {
    const months = [
        'Januari',
        'Februari',
        'Maart',
        'April',
        'Mei',
        'Juni',
        'Juli',
        'Augustus',
        'September',
        'Oktober',
        'November',
        'December'
      ];

    return months;
  }

  getFilter(tpe: string): FilterOption[] {
    let filter: FilterOption[] = [];
    switch (tpe) {
      case 'levels':
        filter = [
          {label: 'Elementair', val: 0},
          {label: 'Basis', val: 1},
          {label: 'Medium', val: 2},
          {label: 'Hoog', val: 3}
        ];
        break;
      case 'tpes':
        filter = [
          {label: 'Zelfst. naamwoord', val: 'noun'},
          {label: 'Bijv. naamwoord', val: 'adj'},
          {label: 'Bijwoord', val: 'adv'},
          {label: 'Werkwoord', val: 'verb'},
          {label: 'Voegwoord', val: 'conj'},
          {label: 'Voorzetsel', val: 'prep'},
          {label: 'Tussenwerpsel', val: 'interj'},
          {label: 'Voornaamwoord', val: 'pronoun'},
          {label: 'Eigennaam', val: 'propernoun'},
          {label: 'Telwoord', val: 'numeral'},
          {label: 'Partikel', val: 'part'},
          {label: 'Uitdrukking', val: 'phrase'}
        ];
        break;
      case 'genus':
        filter = [
          {label: 'Ma', val: 'Ma'},
          {label: 'Mi', val: 'Mi'},
          {label: 'F', val: 'F'},
          {label: 'N', val: 'N'}
        ];
        break;
      case 'cases':
        filter = [
          {label: 'N', val: '1'},
          {label: 'G', val: '2'},
          {label: 'D', val: '3'},
          {label: 'A', val: '4'},
          {label: 'V', val: '5'},
          {label: 'L', val: '6'},
          {label: 'I', val: '7'},
        ];
        break;
    }
    return filter;
  }

  private getRandom(floor: number, ceiling: number) {
    return Math.floor(Math.random() * (ceiling - floor + 1)) + floor;
  }
}

