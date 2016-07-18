import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'settings',
  templateUrl: 'app/components/settings.component.html'
})

export class Settings implements OnInit {
  testLength: number[];
  directions: Object[];
  settings: Object;
  isReady = true;
  isSubmitted = false;

  ngOnInit() {
    this.testLength = [10, 25, 50, 100];
    this.directions = [
      {label:'Nederlands -> Tsjechisch', val:'nlcz'},
      {label:'Tsjechisch -> Nederlands', val:'cznl'}
    ];
    this.settings = {
      wordCnt: 25,
      lanDir: 'nlcz'
    };
    this.isReady = true;
  }

  onSubmit() {
    this.isSubmitted = true;
  }

}
