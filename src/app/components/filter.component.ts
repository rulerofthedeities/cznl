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
  template: `
  <div *ngIf="filtersLoaded" class="filter">
    <ul class="list-unstyled">
      <li>
        <select #level 
          class="form-control input-lg"
          (change)="onChangeFilter(level.value, wordtpe.value, cats.value)">
          <option value="-1" [selected]="'-1'==selected.level">Alle niveaus</option>
          <option 
            *ngFor="let level of filters.levels" [value]="level.val" [selected]="level.val==selected.level">
            {{level.label}}
          </option>
        </select>
      </li>
      <li>
        <select #wordtpe 
          class="form-control input-lg"
          (change)="onChangeFilter(level.value, wordtpe.value, cats.value)">
          <option value="all" [selected]="'all'==selected.tpe">Alle woordsoorten</option>
          <option 
            *ngFor="let tpe of filters.tpes" [value]="tpe.val" [selected]="tpe.val==selected.tpe">
            {{tpe.label}}
          </option>
        </select>
      </li>
      <li>
        <select #cats 
          class="form-control input-lg"
          (change)="onChangeFilter(level.value, wordtpe.value, cats.value)">
          <option value="all" [selected]="'all'==selected.cats">Alle categorieën</option>
          <option 
            *ngFor="let cat of filters.cats" [value]="cat.name" [selected]="cat.name==selected.cats">
            {{cat.name}} {{cat.name===cats.value ? '' : '(' + cat.total + ')'}}
          </option>
        </select>
      </li>
      <li>
        <div class="text-muted">Aantal woorden: <strong>{{totalWords}}</strong></div>
        <div class="buttons"> 
          <button *ngIf="filterTpe==='exercises'"
            class="btn btn-success btn-lg" 
            [disabled]="totalWords < 1"
            (click)="start('review', level.value, wordtpe.value, cats.value)">
          <span class="fa fa-play"></span>
            Overzicht
          </button>
          <button *ngIf="filterTpe==='exercises'"
            class="btn btn-success btn-lg" 
            [disabled]="totalWords < 1"
            (click)="start('practise', level.value, wordtpe.value, cats.value)">
          <span class="fa fa-play"></span>
            Oefen
          </button>
          <button *ngIf="filterTpe==='exercises'"
            class="btn btn-success btn-lg" 
            [disabled]="totalWords < 1"
            (click)="start('test', level.value, wordtpe.value, cats.value)">
          <span class="fa fa-play"></span>
            Start Test
          </button>
        </div>
      </li>
    </ul>
  </div>`,
  styles: [`
    .filter {margin: 0 20px;}
    .btn {margin-top: 6px;}
  `]
})

export class Filter implements OnInit, OnDestroy {
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
