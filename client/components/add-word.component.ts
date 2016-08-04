import {Component, OnInit} from '@angular/core';
import {FilterService} from '../services/filters.service';
import {
  FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES,
  FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  directives: [FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES],
  template:`
    <h1>Add a new word</h1>
    <form 
      [formGroup]="wordForm"
      (ngSubmit) = "onSubmit(wordForm.value)"
      class="form-horizontal">


<!-- COMMON -->

      <div class="row">
        <div class="col-xs-12">
            <div class="panel panel-default">
              <div class="panel-body">

                <div class="form-group" *ngIf="filtersLoaded">
                  <label 
                    for="tpe" 
                    class="control-label col-xs-2">
                    Type:
                  </label>
                  <div class="col-xs-10">
                    <select 
                      class="form-control" 
                      id="tpe"
                      [formControl]="wordForm.controls['tpe']">
                      <option *ngFor="let t of filters.tpes" [value]="t.val">
                        {{t.label}}
                      </option>
                    </select>
                  </div>
                </div>

                <div class="form-group" *ngIf="filtersLoaded">
                  <label 
                    for="level" 
                    class="control-label col-xs-2">
                    Niveau:
                  </label>
                  <div class="col-xs-10">
                    <select 
                      class="form-control" 
                      id="level"
                      [formControl]="wordForm.controls['level']">
                      <option *ngFor="let l of filters.levels" [value]="l.val">
                        {{l.label}}
                      </option>
                    </select>
                  </div>
                </div>

              </div>
            </div>
        </div>
      </div>

<!-- CZ -->

      <div class="row">
        <div class="col-xs-6">
          <div class="panel panel-default">
            <div class="panel-heading"><h3>Tsjechisch</h3></div>
            <div class="panel-body">

              <div class="form-group">
                <label 
                  for="cz.word" 
                  class="control-label col-xs-2">
                  Woord:
                </label>
                <div class="col-xs-10">
                  <input 
                    type="text"
                    class="form-control"
                    id="cz.word"
                    [formControl]="wordForm.controls['cz.word']">
                  <div 
                    *ngIf="isError('cz.word', 'required')"
                    class="text-danger">Het Tsjechische woord ontbreekt.
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

<!-- NL -->

        <div class="col-xs-6">
          <div class="panel panel-default">
            <div class="panel-heading"><h3>Nederlands</h3></div>
            <div class="panel-body">

              <div class="form-group">
              <label 
                for="nl.word" 
                class="control-label col-xs-2">
                Woord:
              </label>
              <div class="col-xs-10">
                <input 
                  type="text"
                  class="form-control"
                  id="nl.word"
                  [formControl]="wordForm.controls['nl.word']">
                <div 
                  *ngIf="isError('nl.word', 'required')"
                  class="text-danger">Het Nederlandse woord ontbreekt.</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
      
      <div class="clearfix"></div>

      <button 
        type="submit" 
        class="btn btn-success" 
        [disabled]="!wordForm.valid">
        Voeg woord toe
      </button>

    </form>
  `,
  styles:[`
    input.ng-dirty.ng-invalid {
      border:1px dotted red;
      border-left:5px solid red;
    }
  `]
})

export class AddWord implements OnInit {
  wordForm: FormGroup;
  filters: Object;
  filtersLoaded = false;

  constructor(
    private filterService: FilterService,
    private fb: FormBuilder) {}

  ngOnInit() {
    this._getFilterOptions();
    this._buildForm();
  }

  isError(fieldName: string, error: string): boolean {
    if (this.wordForm.controls[fieldName].dirty) {
      if (this.wordForm.controls[fieldName].errors) {
        return this.wordForm.controls[fieldName].hasError(error);
      }
    }
  }

  onSubmit(form: any): void {
    console.log('you submitted:', form);
  }

  _buildForm() {
    this.wordForm = this.fb.group({
      'tpe': ['', [Validators.required]],
      'level': ['', [Validators.required]],
      'categories': ['', []],
      'cz.word': ['', [Validators.required]],
      'nl.word': ['', [Validators.required]]
    });
  }

  _getFilterOptions() {
    this.filterService.getFilterOptions().then(
      filters => {
        this.filters = filters;
        //remove first entry for each filter
        for (let key in this.filters) {
            let value = this.filters[key];
            value.shift();
        }
        console.log(this.filters);
        this.filtersLoaded = true;
      }
    );
  }
}
