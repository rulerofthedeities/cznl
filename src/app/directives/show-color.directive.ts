import {Directive, ElementRef, Input, OnInit} from '@angular/core';
import {SettingsService} from '../services/settings.service';
import {ErrorService} from '../services/error.service';

@Directive({
  selector: '[genusColor]'
})

export class GenusColor implements OnInit {
  @Input() genus: string;
  @Input() tpe: string;

  constructor(
    private el: ElementRef,
    private settingsService: SettingsService,
    private errorService: ErrorService
  ) {}

  ngOnInit() {
    if (this.tpe === 'noun') {
      this._getSettings();
    }
  }

  _showGenusColors() {
    let color: string;
    if (this.genus) {
      switch (this.genus.toLowerCase()) {
        case 'f': color = 'red'; break;
        case 'mi': color = 'darkBlue'; break;
        case 'ma': color = 'dodgerBlue'; break;
        case 'n': color = 'green'; break;
        default: color = 'black';
      }
      this.el.nativeElement.style.color = color;
    }
  }

  _getSettings() {
    this.settingsService.getAppSettings().subscribe(
      settings => {
        if (settings.all.showColors) {
          this._showGenusColors();
        }
      },
      error => this.errorService.handleError(error)
    );
  }
}
