import {WordPair} from '../model/word.model';

const firstWordSrc = {language:'cz', word:'pes', article:'ten', genus:'Ma'};
const firstWordTgt = {language:'nl', word:'hond', article:'de', genus:''};
const secondWordSrc = {language:'cz', word:'kočka', article:'ta', genus:'F'};
const secondWordTgt = {language:'nl', word:'kat', article:'de', genus:''};

export const WORDS: WordPair[] = [
  {src:firstWordSrc, tgt: firstWordTgt, tpe: 'noun', categories:['dieren', 'zoogdieren', 'huisdieren']},
  {src:secondWordSrc, tgt: secondWordTgt, tpe: 'noun', categories:['dieren', 'zoogdieren', 'huisdieren']}
];
