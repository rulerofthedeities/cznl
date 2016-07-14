import {Injectable} from '@angular/core';
import {WORDS} from '../data/words';

@Injectable()
export class WordService {
  getWords() {
    return Promise.resolve(WORDS);
  }
}
