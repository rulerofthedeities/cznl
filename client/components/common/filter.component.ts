import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {FilterService} from '../../services/filters.service';

@Component({
  selector: 'filter',
  providers: [FilterService],
  template: `
  <div [ngSwitch]="tpe" *ngIf="filters" class="filter">
    <ul *ngSwitchCase="'default'" class="list-unstyled">
      <li>
        <select #level class="form-control">
          <option 
            *ngFor="let level of filters.levels">
            {{level}}
          </option>
        </select>
      </li>
      <li>
        <select #wordtpe class="form-control">
          <option 
            *ngFor="let tpe of filters.tpes">
            {{tpe}}
          </option>
        </select>
      </li>
      <li>
        <select #cats class="form-control">
          <option 
            *ngFor="let cat of filters.cats">
            {{cat}}
          </option>
        </select>
      </li>
      <li 
        class="btn btn-success btn-lg" 
        (click)="startTest(level.value, wordtpe.value, cats.value)">
        Start Test
      </li>
    </ul>
    <ul 
      *ngSwitchCase="'user'"
      class="list-group">
      <li class="list-group-item">Lijst 1<span class="badge">12</span></li>
      <li class="list-group-item">Lijst 2<span class="badge">8</span></li>
      <li
        class="btn btn-success btn-lg disabled">
        Start Test
      </li>
    </ul>
  </div>`,
  styles: [`
    .filter {margin: 0 20px;}
    .btn {margin-top: 6px;}
  `]
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
