import { Directive, HostListener, Input, Output, EventEmitter } from '@angular/core';

@Directive({selector: '[pressed]'})
export class GetKeyPress {
  @Input() key: string;
  @Output() keyPressed = new EventEmitter();
  @HostListener('document:keydown', ['$event'])

  keypress(e: KeyboardEvent) {
    if (e.key.toString() === this.key) {
      this.keyPressed.emit(true);
    }
  }
}
