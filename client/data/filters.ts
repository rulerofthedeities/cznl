import {FilterOption} from '../models/filters.model';

export const LEVELS:FilterOption[] = [
  {label:'Elementair', val:0},
  {label:'Basis', val:1},
  {label:'Medium', val:2},
  {label:'Hoog', val:3}
];
export const TPES:FilterOption[] = [
  {label:'Zelfst. naamwoord', val:'noun'},
  {label:'Bijv. naamwoord', val: 'adj'},
  {label:'Werkwoord', val: 'verb'},
  {label:'Bijwoord', val: 'adv'},
  {label:'Voegwoord', val: 'conj'},
  {label:'Voorzetsel', val: 'prep'},
  {label:'Voornaamwoord', val: 'pronoun'},
  {label:'Eigennaam', val: 'propernoun'},
  {label:'Telwoord', val: 'numeral'}
];
export const GENUS:FilterOption[] = [
  {label:'Ma', val: 'Ma'},
  {label:'Mi', val: 'Mi'},
  {label:'F', val: 'F'},
  {label:'N', val: 'N'}
];
export const CASES:FilterOption[] = [
  {label:'N', val: '1'},
  {label:'G', val: '2'},
  {label:'D', val: '3'},
  {label:'A', val: '4'},
  {label:'V', val: '5'},
  {label:'L', val: '6'},
  {label:'I', val: '7'},
];
