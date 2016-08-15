import {Component, Input} from '@angular/core';

@Component({
  selector: 'simple-modal',
  template: `
    <key pressed
      key="Escape" 
      (keyPressed)="closeModal()">
    </key>
    <div 
      *ngIf="_isVisible" 
      class="modal fade show in" 
      id="myModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <ng-content select="[header]"></ng-content>
            <h4 class="modal-title">{{title}}</h4>
          </div>
          <div class="modal-body">
            <ng-content select="[body]"></ng-content>
          </div>
          <div class="modal-footer">
            <ng-content select="[footer]"></ng-content>
          </div>
        </div>
      </div>
    </div>`,
  styles:[`
    div.modal {color: black;text-align:left;}
  `]
})

export class Modal {
  @Input() title;
  private _isVisible = true;

  openModal() {
    this._isVisible = true;
  }

  closeModal() {
    this._isVisible = false;
  }
}
