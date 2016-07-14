import {Component} from '@angular/core';
import {Filter} from './common/filter.component';

@Component({
  selector: 'tests',
  directives: [Filter],
  template:`
  <h1>Word tests</h1>
  <ul>
    <li (click)="selectListType('default')">Selecteer woordenlijst</li>
    <li (click)="selectListType('user')">Mijn woordenlijst</li>
  </ul>
  <filter *ngIf="!started"
    [tpe]="listType"
    (selectedFilter)="onSelectFilter($event)">
  </filter>
  <div *ngIf="started">
    Filter data: {{filterData|json}}
  </div>

  `,
  styles: [
  `li {cursor:pointer;}`]
})

export class Tests {
  listType: string = 'default';
  filterData: Object;
  started: boolean = false;

  selectListType(tpe) {
    this.listType = tpe;
  }

  onSelectFilter(filter: Object) {
    this.filterData = filter;
    this.started = true;
  }
}
