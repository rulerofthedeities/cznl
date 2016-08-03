import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'edit-list-name',
  template: `
    <span class="form-inline">
      <input 
        type="text" 
        class="form-control"
        [ngClass]="{error:isError}"
        (keyup)="changedListName($event)"
        [value]="name"
        #list>
      <button 
        class="btn btn-primary"
        (click)="save(list.value)">
        Save
      </button>
      <button 
        class="btn btn-default"
        (click)="cancel()">
        Cancel
      </button>
    </span>
    <p  
      class="text-danger"
      *ngIf="isError">
      {{errorMsg}}
    </p>
    {{name}}`,
  styles:[`
    .error {
      border-left: 5px solid #a94442; /* red */
    }`]
})

export class EditList {
  @Input() name;
  @Output() updatedName = new EventEmitter<string>();
  @Output() addNewList = new EventEmitter<string>();
  isError = false;
  errorMsg: string;

  save(listName: string) {
    this.validateListName(listName);
    if (!this.isError) {
      if (this.name) {
        this.updatedName.emit(listName);
      } else {
        this.addNewList.emit(listName);
      }
    }
  }

  cancel() {
    if (this.name) {
      this.updatedName.emit(null);
    } else {
      this.addNewList.emit(null);
    }
  }

  changedListName(event:KeyboardEvent) {
    this.isError = false;
  }

  private validateListName(listName: string) {
    if (listName.length < 3) {
      this.isError = true;
      this.errorMsg = 'De lijstnaam moet minstens twee karakters lang zijn.';
    }
  }
}
