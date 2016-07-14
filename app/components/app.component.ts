import {Component, OnInit} from '@angular/core';
import {WordService} from '../services/words.service';
import {WordPair} from '../model/word';
import {Menu} from './menu.component';

@Component({
  selector: 'cz',
  directives: [Menu],
  providers: [WordService],
  template: `
    <menu></menu>
    <ul>
      <li *ngFor="let word of words">
        {{word.src.word}} -> {{word.tgt.word}}
      </li>
    </ul>`
})
export class AppComponent implements OnInit {
  public words: WordPair[];

  constructor(private wordService: WordService) {}

  ngOnInit() {
    this.getWords();
  }

  getWords() {
    this.wordService.getWords()
      .then(wordlist => this.words = wordlist);
  }
}
