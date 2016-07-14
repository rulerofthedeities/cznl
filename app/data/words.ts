import {WordPair} from '../model/word';

const firstWordSrc = {language:'cz', word:'pes', article:'ten', genus:'Ma'};
const firstWordTgt = {language:'nl', word:'hond', article:'de', genus:''};
const secondWordSrc = {language:'cz', word:'kočka', article:'ta', genus:'F'};
const secondWordTgt = {language:'nl', word:'kat', article:'de', genus:''};

export const WORDS: WordPair[] = [
  {src:firstWordSrc, tgt: firstWordTgt, categories:['dieren', 'zoogdieren', 'huisdieren']},
  {src:secondWordSrc, tgt: secondWordTgt, categories:['dieren', 'zoogdieren', 'huisdieren']}
];
