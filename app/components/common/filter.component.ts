import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {FilterService} from '../../services/filters.service';

@Component({
  selector: 'filter',
  providers: [FilterService],
  template: `
  <div [ngSwitch]="tpe" *ngIf="filters">
    <ul *ngSwitchCase="'default'">
      <li>
        <select #level>
          <option 
            *ngFor="let level of filters.levels">
            {{level}}
          </option>
        </select>
      </li>
      <li>
        <select #wordtpe>
          <option 
            *ngFor="let tpe of filters.tpes">
            {{tpe}}
          </option>
        </select>
      </li>
      <li>
        <select #cats>
          <option 
            *ngFor="let cat of filters.cats">
            {{cat}}
          </option>
        </select>
      </li>
      <li (click)="startTest(level.value, wordtpe.value, cats.value)">Start</li>
    </ul>
    <ul *ngSwitchCase="'user'">
      <li>Lijst 1</li>
      <li>Lijst 2</li>
      <li>Select #words</li>
      <li>Start</li>
    </ul>
  </div>`
})

export class Filter implements OnInit {
  @Input() tpe: string;
  @Output() selectedFilter = new EventEmitter<Object>();
  filters: Object;

  constructor(private filterService: FilterService) {}

  ngOnInit() {
    this.getFilterData();
  }

  startTest(level, wordtpe, cats) {
    let filterObj = {
      'level': level,
      'tpe': wordtpe,
      'cats': cats
    };
    this.selectedFilter.emit(filterObj);
  }

  getFilterData() {
    this.filterService.getFilterData().then(
      filters => {
        this.filters = filters;
      }
    );
  }

}
