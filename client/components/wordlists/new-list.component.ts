import {Component, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'new-list',
  template: `
    <div class="form-inline">
    <input 
      type="text" 
      class="form-control"
      [ngClass]="{error:isError}"
      (keyup)="changedListName($event)"
      #newList>
    <button 
      class="btn btn-primary"
      (click)="saveNewList(newList.value)">
      Voeg nieuwe lijst toe
    </button>
    <button 
      class="btn btn-default"
      (click)="cancelNewList()">
      Cancel
    </button>
    </div>
    <p  
      class="text-danger"
      *ngIf="isError">
      {{errorMsg}}
    </p>
  `,
  styles:[`
    .error {
      border-left: 5px solid #a94442; /* red */
    }`]
})

export class NewList {
  @Output() addNewList = new EventEmitter<string>();
  isError = false;
  errorMsg: string;

  saveNewList(listName: string) {
    this.validateListName(listName);
    if (!this.isError) {
      this.addNewList.emit(listName);
    }
  }

  cancelNewList() {
    this.addNewList.emit(null);
  }

  changedListName(event:KeyboardEvent) {
    this.isError = false;
  }

  validateListName(listName: string) {
    if (listName.length < 3) {
      this.isError = true;
      this.errorMsg = 'De lijstnaam moet minstens twee karakters lang zijn.';
    }

  }
}
