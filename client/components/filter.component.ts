import {Component, Output, Input, EventEmitter, OnInit} from '@angular/core';
import {FilterService} from '../services/filters.service';
import {SettingsService} from '../services/settings.service';
import {WordService} from '../services/words.service';
import {Filter as FilterModel} from '../models/filters.model';

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
            *ngFor="let cat of filters.cats" [value]="cat" [selected]="cat==selected.cats">
            {{cat}}
          </option>
        </select>
      </li>
      <li>
        <div class="text-muted">Aantal woorden: <strong>{{totalWords}}</strong></div>
        <div class="buttons"> 
          <button *ngIf="filterTpe==='exercises'"
            class="btn btn-success btn-lg" 
            [disabled]="totalWords < 1"
            (click)="start('test', level.value, wordtpe.value, cats.value)">
          <span class="fa fa-play"></span>
            Start Test
          </button>
          <button *ngIf="filterTpe==='exercises'"
            class="btn btn-success btn-lg" 
            [disabled]="totalWords < 1"
            (click)="start('review', level.value, wordtpe.value, cats.value)">
          <span class="fa fa-play"></span>
            Toon Overzicht
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

export class Filter implements OnInit {
  @Input('tpe') filterTpe: string;
  @Output() selectedFilter = new EventEmitter<FilterModel>();
  filters: Object;
  selected: FilterModel;
  totalWords: number;
  filtersLoaded = false;

  constructor(
    private filterService: FilterService,
    private settingsService: SettingsService,
    private wordService: WordService) {}

  ngOnInit() {
    this.getFilterOptions();
  }

  start(testTpe: string, level: string, wordTpe: string, cat: string) {
    if (this.totalWords < 1) {return;}
    let filter:FilterModel = this.getFilter(testTpe, level, wordTpe, cat);
    this.settingsService.setFilterSettings(filter);
    this.selectedFilter.emit(filter);
  }

  onChangeFilter(level: string, wordTpe: string, cat: string) {
    let filter:FilterModel = this.getFilter('none', level, wordTpe, cat);
    this.getCount(filter);
    if (this.filterTpe === 'wordbank') {
      this.start('wordbank', level, wordTpe, cat);
    }
  }

  getCount(filter: FilterModel) {
    this.wordService.getCount(filter)
      .then(total => {this.totalWords = total;});
  }

  getFilter(testTpe: string, level: string, wordTpe: string, cat: string) {
    let filter:FilterModel = {
      'level': parseInt(level, 10),
      'tpe': wordTpe,
      'cats': cat,
      'test': testTpe
    };

    return  filter;
  }

  getFilterOptions() {
    this.settingsService.getFilterSettings().then(
      settings => {
        this.selected = settings.filter;
        this.getCount(settings.filter);
        this.filterService.getFilterOptions().then(
          filters => {
            this.filters = filters;
            //this.filters.levels.unshift({label:'Alle niveaus', val:-1});
            //this.filters.tpes.unshift({label:'Alle Woordsoorten', val:'all'});
            //this.filters.cats.unshift({label:'Alle categorieën', val:'all'});
            this.filtersLoaded = true;
          }
        );
      }
    );
  }

}