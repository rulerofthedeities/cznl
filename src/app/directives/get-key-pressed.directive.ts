import {Directive, HostListener, Input, Output, EventEmitter} from '@angular/core';

@Directive({selector: '[pressed]'})
export class GetKeyPress {
  @Input() keyPressed: string;
  @Output() onKeyPressed = new EventEmitter();
  @HostListener('document:keydown', ['$event'])

  keypress(e: KeyboardEvent) {
    if (e.key.toString() === this.keyPressed) {
      this.onKeyPressed.emit(true);
    }
  }
}
