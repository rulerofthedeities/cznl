import {Component, Output, EventEmitter, OnInit} from '@angular/core';
import {FilterService} from '../services/filters.service';
import {SettingsService} from '../services/settings.service';
import {WordService} from '../services/words.service';
import {Filter as FilterModel} from '../models/filters.model';

@Component({
  selector: 'filter',
  providers: [FilterService],
  template: `
  <div *ngIf="filters" class="filter">
    <ul class="list-unstyled">
      <li>
        <select #level 
          class="form-control input-lg"
          (change)="onChangeFilter(level.value, wordtpe.value, cats.value)">
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
          <option 
            *ngFor="let cat of filters.cats" [value]="cat.val" [selected]="cat.val==selected.cats">
            {{cat.label}}
          </option>
        </select>
      </li>
      <li>
      <div class="text-muted">Aantal woorden: <strong>{{totalWords}}</strong></div>
      <div class="buttons"> 
        <button 
          class="btn btn-success btn-lg" 
          [disabled]="totalWords < 1"
          (click)="start('test', level.value, wordtpe.value, cats.value)">
        <span class="fa fa-play"></span>
          Start Test
        </button>
        <button 
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
  @Output() selectedFilter = new EventEmitter<Object>();
  filters: Object;
  selected: FilterModel;
  totalWords: number;

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
  }

  getCount(filter: FilterModel) {
    this.wordService.getCount(filter)
      .then(total => {this.totalWords = total;});
  }

  getFilter(testTpe: string, level: string, wordTpe: string, cat: string) {
    return  {
      'level': parseInt(level, 10),
      'tpe': wordTpe,
      'cats': cat,
      'test': testTpe
    };
  }

  getFilterOptions() {
    this.settingsService.getFilterSettings().then(
      settings => {
        this.selected = settings.filter;
        this.getCount(settings.filter);
        this.filterService.getFilterOptions().then(
          filters => {
            this.filters = filters;
          }
        );
      }
    );
  }

}
