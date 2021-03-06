import {Component, Input, Output, EventEmitter, OnDestroy} from '@angular/core';
import {WordPair} from '../../models/word.model';
import {WordList} from '../../models/list.model';
import {WordlistService} from '../../services/wordlists.service';
import {ErrorService} from '../../services/error.service';
import 'rxjs/add/operator/takeWhile';

@Component({
    selector: 'show-lists',
    templateUrl: './show-lists.component.html',
    styles: [`div.modal {color: black;text-align:left;}`],
    styleUrls: ['./word-list.css']
})

export class ShowListsComponent implements OnDestroy {
  @Input() word: WordPair;
  @Output() userlistChanged = new EventEmitter<any>();
  userLists: WordList[];
  isWordInList: boolean[] = [];
  isVisible = false;
  changesMade = false;
  creatingNewList = false;
  listEditing: number;
  listsEdited: number[] = [];
  listsToggled: number[] = [];
  componentActive = true;

  constructor(
    private wordlistService: WordlistService,
    private errorService: ErrorService
  ) {}

  _checkIfWordInLists() {
    // build array that shows which lists the current word is in
    let filtered_list: string[], i = 0;
    this.userLists.forEach(list => {
      filtered_list = [];
      if (list.wordIds) {
        filtered_list = list.wordIds.filter(wordId => wordId === this.word._id);
      }
      this.isWordInList[i++] = filtered_list.length > 0;
    });
  }

  updateUserLists(word: WordPair) {
    this.wordlistService
    .getWordLists('user')
    .takeWhile(() => this.componentActive)
    .subscribe(
      lists => {
        this.userLists = lists;
        this._checkIfWordInLists();
        this.creatingNewList = false;
        this.changesMade = false;
        this.isVisible = true;
      },
      error => this.errorService.handleError(error));
  }

  editListName(list: WordList, i: number) {
    this.listEditing = i;
    this.listsEdited.push(i);
  }

  updateListName(newName: string) {
    if (newName) {
      this.userLists[this.listEditing].name = newName;
      this.changesMade = true;
    }
    this.listEditing = null;
  }

  hideLists() {
    this.isVisible = false;
  }

  toggleInList(i: number) {
    this.isWordInList[i] = !this.isWordInList[i];
    this.listsToggled.push(i);
    this.changesMade = true;
  }

  onNewListAdded(listName: string) {
    if (listName) { // null = cancelled new list
      // add to list array
      const newList: WordList = {name: listName, count: 0};
      if (!this.userLists) { this.userLists = []; }
      this.userLists.push(newList);
      this.toggleInList(this.userLists.length - 1);
      this.changesMade = true;
    }
    this.creatingNewList = false;
  }

  saveLists() {
    event.stopPropagation();
    const toSaveLists: WordList[] = this.userLists.filter(list => !list._id);
    if (toSaveLists.length > 0) {
      this._saveNewLists(toSaveLists, () => {
        this._saveEditedLists();
        this._saveWordsInLists();
      });
    } else {
        this._saveEditedLists();
        this._saveWordsInLists();
    }

    this.hideLists();
  }

  _saveNewLists(lists: WordList[], callback) {
    // Save new lists -> if no _id, list is new
    let cnt = 0;
    lists.map((list) => {
      cnt++;
      this._saveNewList(list, cnt, function(){
        if (cnt === lists.length) {
          callback();
        }
      });
    });
  }

  _saveNewList(list: WordList, cnt: number, callback) {
    this.wordlistService
    .saveList(list)
    .takeWhile(() => this.componentActive)
    .subscribe(
      result  => {
        list._id = result.insertedIds[0];
        callback();
      },
      error => this.errorService.handleError(error)
    );
  }

  _saveEditedLists() {
    // Save edited lists (name changed)
    this.listsEdited.forEach(i => {
      this.wordlistService
      .updateListName(this.userLists[i])
      .takeWhile(() => this.componentActive)
      .subscribe(
        list  => { ; },
        error => this.errorService.handleError(error)
      );
    });
  }

  _saveWordsInLists() {
    // Edit list of words in this list
    this.listsToggled.forEach(i => {
      // Add list , list ID, word ID
      this.wordlistService
      .updateWordList(this.isWordInList[i], this.userLists[i]._id, this.word._id)
      .takeWhile(() => this.componentActive)
      .subscribe(
        update => this.userlistChanged.emit(update),
        error => this.errorService.handleError(error)
      );
    });
  }

  createNewList() {
    this.creatingNewList = true;
  }

  stopPropagation() {
    event.stopPropagation();
  }

  ngOnDestroy() {
    this.componentActive = false;
  }
}
