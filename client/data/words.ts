import {WordPair} from '../model/word.model';

const firstWordCz = {language:'cz', word:'pes', article:'ten', genus:'Ma'};
const firstWordNl = {language:'nl', word:'hond', article:'de', genus:''};
const secondWordCz = {language:'cz', word:'kočka', article:'ta', genus:'F'};
const secondWordNl = {language:'nl', word:'kat', article:'de', genus:''};

export const WORDS: WordPair[] = [
  {cz:firstWordCz, nl: firstWordNl, tpe: 'noun', categories:['dieren', 'zoogdieren', 'huisdieren']},
  {cz:secondWordCz, nl: secondWordNl, tpe: 'noun', categories:['dieren', 'zoogdieren', 'huisdieren']}
];
