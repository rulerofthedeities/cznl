import {Injectable} from '@angular/core';
import {WORDS} from '../data/words';

@Injectable()
export class WordService {
  getWords(filter:string, maxWords:number) {
    return Promise.resolve(WORDS);
  }
}
