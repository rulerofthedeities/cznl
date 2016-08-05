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
  {label:'Voorzetsel', val: 'prep'}
];
export const GENUS:FilterOption[] = [
  {label:'Ma', val: 'Ma'},
  {label:'Mi', val: 'Mi'},
  {label:'F', val: 'F'},
  {label:'N', val: 'N'}
];
export const CATS:FilterOption[] = [
  {label:'Dieren', val: 'dieren'},
  {label:'Beroepen', val: 'beroepen'}
];
