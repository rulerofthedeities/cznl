import {Directive, Input, OnInit, ElementRef} from '@angular/core';
import {FilterService} from '../services/filters.service';

@Directive({selector: '[getFilterValue]'})
export class GetFilterValue implements OnInit {
  @Input('value') srcValue: string;
  @Input('tpe') filterTpe: string;
  filters: Object;

  constructor (
    private filterService: FilterService,
    private el: ElementRef
  ) {}

  ngOnInit() {
    this._getFilterOptions();
  }

  _getValue(): string {
    let translation = '';
    let list = this.filters[this.filterTpe];
    for (let key in list) {
      if (this.srcValue === list[key].val) {
        translation = list[key].label;
      }
    }
    return translation;
  }

  _getFilterOptions() {
    this.filterService.getFilterOptions().subscribe(
      filters => {
        this.filters = filters;
        this.el.nativeElement.innerText = this._getValue();
      }
    );
  }
}
