import {Component} from '@angular/core';
import {WordPair, Answer} from '../../models/word.model';
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
  isVisible = false;
  changesMade = false;
  creatingNewList = false;
  listEditing: number;
  listsEdited: number[] = [];
  wordAnswer: Answer;
  userLists: WordList[];

  constructor(private wordlistService: WordlistService) {}

  updateUserLists(word: WordPair) {
    this.wordlistService.getWordLists('user')
      .then(lists => {
        this.userLists = lists;
        this.wordAnswer = word.answer;
        this.wordAnswer.wordId = word._id;
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

  isInList(list: WordList) {
    let isInList = false;
    if (this.wordAnswer.listIds) {
      let filtered_list = this.wordAnswer.listIds.filter(id => list._id === id);
      isInList = filtered_list.length > 0;
    }
    return isInList;
  }

  toggleInList(list: WordList) {
    if (this.isInList(list)) {
      //Remove from list
      this.wordAnswer.listIds = this.wordAnswer.listIds.filter(id => list._id !== id);
    } else {
      //Add to list
      if(!this.wordAnswer.listIds) {
        this.wordAnswer.listIds = [];
      }
      this.wordAnswer.listIds.push(list._id);
    }
    this.changesMade = true;
  }

  onNewListAdded(listName: string) {
    if (listName) { // null = cancelled new list
      //add to list array
      let newList: WordList = {
        name: listName,
        count: 0
      };
      if (!this.userLists) { this.userLists = [];}
      this.userLists.push(newList);
      this.toggleInList(newList);
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

    //Save lists array for this particular word
    this.wordlistService.updateWordLists(this.wordAnswer);
    this.hideLists();
  }

  createNewList() {
    this.creatingNewList = true;
  }


}
