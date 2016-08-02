import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'edit-list-name',
  template: `
    <span class="form-inline">
      <input 
        type="text" 
        class="form-control"
        [ngClass]="{error:isError}"
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
    </p>`
})

export class EditListName {
  @Input() name;
  @Output() updatedName = new EventEmitter<string>();

  save(newName: string) {
    this.updatedName.emit(newName);
  }

  cancel() {
    this.updatedName.emit(null);
  }
}
