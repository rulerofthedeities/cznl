import {Component, OnInit} from '@angular/core';
import {FilterService} from '../services/filters.service';
import {WordService} from '../services/words.service';
import {ErrorObject} from '../models/word.model';
import {WordPair} from '../models/word.model';
import {
  FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES,
  FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  directives: [FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES],
  templateUrl:'/client/components/add-word.component.html',
  styles:[`
    input.ng-dirty.ng-invalid {
      border: 1px dotted red;
      border-left: 5px solid red;
    }
  `]
})

export class AddWord implements OnInit {
  wordForm: FormGroup;
  filters: Object;
  filtersLoaded = false;
  submitMessage: string;
  disableSubmit = false;

  constructor(
    private filterService: FilterService,
    private wordService: WordService,
    private formBuilder: FormBuilder) {}

  ngOnInit() {
    this._getFilterOptions();
    this._buildForm();
  }

  isNoun() {
    return this.wordForm.controls['tpe'].value === 'noun';
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
    this.wordService.addWord(form).then(word => {
      let wordPair: WordPair = word['word'];
      this.submitMessage = `Het woord ${wordPair['cz'].word}/${wordPair['nl'].word} is succesvol opgeslagen.`;
      this.disableSubmit = true;
    });
  }

  resetForm() {
    this._buildForm();
    this.submitMessage = '';
    this.disableSubmit = false;
  }

  _buildForm() {
    this.wordForm = this.formBuilder.group({
      'tpe': ['', [Validators.required]],
      'level': ['', [Validators.required]],
      'categories': ['', []],
      'cz.word': ['', [Validators.required]],
      'nl.word': ['', [Validators.required]],
      'cz.genus': ['', []],
      'nl.article': ['', []]
    }, {validator: this.checkOptionalValidations});
  }

  _getFilterOptions() {
    this.filterService.getFilterOptions().then(
      filters => {
        this.filters = filters;
        this.filtersLoaded = true;
      }
    );
  }

  //Check validations that are dependent on other fields
  checkOptionalValidations(group: FormGroup) {

    let valid = true,
        errObj:ErrorObject = {};

    if (group.controls['tpe'].value === 'noun') {
      if (!group.controls['nl.article'].value) {
        valid = false;
        errObj.article = false;
      };
      if (!group.controls['cz.genus'].value) {
        valid = false;
        errObj.genus = false;
      };
    }

    if (valid) {
      return null;
    }

    return errObj;
  }

}

