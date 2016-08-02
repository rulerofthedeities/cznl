import { Component, OnInit } from '@angular/core';
import { GetKeyPress } from '../../directives/get-key-pressed.directive';
import { WordPair, Answer } from '../../models/word.model';
import { WordlistService } from '../../services/wordlists.service';
import { WordList } from '../../models/list.model';
import {NewList} from './new-list.component';

@Component({
    selector: 'show-lists',
    directives: [GetKeyPress, NewList],
    template: `
      <key pressed 
        key="Escape" 
        (keyPressed)="hideLists()">
      </key>
      <div 
        *ngIf="isVisible" 
        class="modal fade show in" 
        id="myModal">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <button 
                type="button" 
                class="close" 
                (click)="hideLists()"
                data-dismiss="modal">
                &times;
              </button>
              <h4 class="modal-title">Mijn Woordenlijsten</h4>
            </div>
            <div class="modal-body">
              <ul class="list-group">
                <li 
                  *ngFor="let list of userLists"
                   class="list-group-item">
                  {{list.name}}
                  <span 
                    class="fa pull-right"
                    [ngClass]="{
                      'fa-star':isInList(list),
                      'fa-star-o':!isInList(list)}"
                    (click)="toggleInList(list)">
                  </span>
                </li>
                <li 
                  class="list-group-item"
                  *ngIf="creatingNewList">
                  <new-list
                    (addNewList)="onNewListAdded($event)"></new-list>
                </li>
              </ul>
            </div>
            <div class="modal-footer">
              <button 
                type="button" 
                class="btn btn-primary" 
                (click)="saveLists()"
                [disabled]="!changesMade">
                Sla Wijzigingen op
              </button>
              <button 
                type="button" 
                class="btn btn-default" 
                (click)="createNewList()"
                [disabled]="creatingNewList"
                >
                Nieuwe Lijst
              </button>
              <button 
                type="button" 
                class="btn btn-default" 
                (click)="hideLists()"
                >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    `,
    styles:[`
      div.modal {color: black;text-align:left;}
    `],
    styleUrls:['client/components/wordlists/word-list.css']
})

export class ShowLists implements OnInit {
  isVisible = false;
  changesMade = false;
  creatingNewList = false;
  wordAnswer: Answer;
  userLists: WordList[];

  constructor(private wordlistService: WordlistService) {}

  ngOnInit() {
    this.wordlistService.getWordLists()
      .then(lists => {this.userLists = lists;});
  }

  updateUserLists(word: WordPair) {
    this.wordAnswer = word.answer;
    this.wordAnswer.wordId = word._id;
    this.creatingNewList = false;
    this.isVisible = true;
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
      this.wordAnswer.listIds = this.wordAnswer.listIds.filter(id => list._id !== id);
    } else {
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

    //Save lists array for this particular word
    this.wordlistService.updateWordLists(this.wordAnswer);
    this.hideLists();
  }

  createNewList() {
    this.creatingNewList = true;
  }


}
