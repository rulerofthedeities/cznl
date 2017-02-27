import {Component, Output, Input, EventEmitter, OnInit, OnDestroy} from '@angular/core';
import {FilterService} from '../services/filters.service';
import {SettingsService} from '../services/settings.service';
import {WordService} from '../services/words.service';
import {AuthService} from '../services/auth.service';
import {ErrorService} from '../services/error.service';
import {Filter as FilterModel} from '../models/filters.model';
import 'rxjs/add/operator/takeWhile';

@Component({
  selector: 'filter',
  templateUrl: 'filter.component.html',
  styles: [`
    .filter {margin: 0 20px;}
    .btn {margin-top: 6px;}
  `]
})

export class FilterComponent implements OnInit, OnDestroy {
  @Input('tpe') filterTpe: string;
  @Output() selectedFilter = new EventEmitter<FilterModel>();
  filters: Object;
  selected: FilterModel;
  totalWords: number;
  filtersLoaded = false;
  componentActive = true;

  constructor(
    private filterService: FilterService,
    private settingsService: SettingsService,
    private authService: AuthService,
    private wordService: WordService,
    private errorService: ErrorService
  ) {}

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.getFilterOptions();
    }
  }

  start(testTpe: string, level: string, wordTpe: string, cat: string) {
    if (this.totalWords < 1) { return; }
    const filter: FilterModel = this.getFilter(testTpe, level, wordTpe, cat);
    this.settingsService
    .setFilterSettings(filter)
    .takeWhile(() => this.componentActive)
    .subscribe(
      settings => { ; },
      error => this.errorService.handleError(error)
    );
    filter.cats = filter.cats.toLowerCase();
    this.selectedFilter.emit(filter);
  }

  onChangeFilter(level: string, wordTpe: string, cat: string) {
    const filter: FilterModel = this.getFilter('none', level, wordTpe, cat);
    this.getCount(filter);
    if (this.filterTpe === 'wordbank') {
      this.start('wordbank', level, wordTpe, cat);
    }
  }

  getCount(filter: FilterModel) {
    this.wordService
    .getCount(filter)
    .takeWhile(() => this.componentActive)
    .subscribe(
      total => { this.totalWords = total; },
      error => this.errorService.handleError(error)
    );
  }

  getFilter(testTpe: string, level: string, wordTpe: string, cat: string) {
    const filter: FilterModel = {
      'level': parseInt(level, 10),
      'tpe': wordTpe,
      'cats': cat,
      'test': testTpe
    };
    return  filter;
  }

  getFilterOptions() {
    this.settingsService
    .getFilterSettings()
    .takeWhile(() => this.componentActive)
    .subscribe(
      settings => {
        if (settings) {
          this.selected = settings.filter;
        } else {
          this.selected = {level: -1, cats: 'all', tpe: 'all'};
        }
        this.getCount(this.selected);
        this.filterService
        .getFilterOptions()
        .takeWhile(() => this.componentActive)
        .subscribe(
          filters => {
            this.filters = filters;
            this.filtersLoaded = true;
          },
          error => this.errorService.handleError(error)
        );
      }
    );
  }

  ngOnDestroy() {
    this.componentActive = false;
  }
}
