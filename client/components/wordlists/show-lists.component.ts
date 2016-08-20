import {Component, Input, Output, EventEmitter} from '@angular/core';
import {WordPair} from '../../models/word.model';
import {WordlistService} from '../../services/wordlists.service';
import {WordList} from '../../models/list.model';

@Component({
    selector: 'show-lists',
    templateUrl: 'client/components/wordlists/show-lists.component.html',
    styleUrls:['client/components/wordlists/word-list.css'],
    styles:[`
      div.modal {color: black;text-align:left;}
    `]
})

export class ShowLists {
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

  constructor(private wordlistService: WordlistService) {}

  _checkIfWordInLists() {
    //build array that shows which lists the current word is in
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
    this.wordlistService.getWordLists('user')
      .then(lists => {
        this.userLists = lists;
        this._checkIfWordInLists();
        this.creatingNewList = false;
        this.changesMade = false;
        this.isVisible = true;
    });
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
      //add to list array
      let newList: WordList = {name: listName, count: 0};
      if (!this.userLists) { this.userLists = [];}
      this.userLists.push(newList);
      this.toggleInList(this.userLists.length - 1);
      this.changesMade = true;
    }
    this.creatingNewList = false;
  }

  saveLists() {
    //Save new lists -> if no _id, list is new
    this.userLists.forEach( list => {
      if (!list._id) {
        this.wordlistService.saveList(list);
      }
    });

    //Save edited lists
    this.listsEdited.forEach(i => {
      this.wordlistService.updateListName(this.userLists[i]);
    });

    //Edit list of words in this list
    this.listsToggled.forEach(i => {
      //add list , list ID, word ID
      this.wordlistService
        .updateWordList(this.isWordInList[i], this.userLists[i]._id, this.word._id)
        .then(update => {
          this.userlistChanged.emit(update);
        });
    });

    this.hideLists();
  }

  createNewList() {
    this.creatingNewList = true;
  }

}
