import {Component, OnInit, OnDestroy} from '@angular/core';
import {FilterService} from '../services/filters.service';
import {WordService} from '../services/words.service';
import {ErrorObject} from '../models/word.model';
import {WordPair} from '../models/word.model';
import {Subscription} from 'rxjs/Subscription';
import {
  FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES,
  FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';

@Component({
  selector: 'edit-word',
  directives: [FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES],
  templateUrl:'/client/components/edit-word.component.html',
  styles:[`
    input.ng-dirty.ng-invalid {
      border: 1px dotted red;
      border-left: 5px solid red;
    }
    .label {
      margin:2px;
      cursor:pointer;
    }
    strong .form-control {
      color:blue;
    }
    .optional {
      color: grey;
    }
    .fa-times {
      color: red;
    }
  `]
})

export class EditWord implements OnInit, OnDestroy {
  wordForm: FormGroup;
  filters: Object;
  filtersLoaded = false;
  submitMessage: string;
  disableSubmit = false;
  isNew: boolean;
  subscription: Subscription;
  cats: string[];

  constructor(
    private filterService: FilterService,
    private wordService: WordService,
    private formBuilder: FormBuilder) {}

  ngOnInit() {
    this._getFilterOptions();
    this._buildNewForm();
    this.subscription = this.wordService.editWordSource$.subscribe(
      word => {
        this.editForm(word);
      }
    );
  }

  isNoun() {
    return this.wordForm.controls['tpe'].value === 'noun';
  }

  isVerb() {
    return this.wordForm.controls['tpe'].value === 'verb';
  }

  canHaveCase() {
    let tpe = this.wordForm.controls['tpe'].value;
    return tpe === 'verb' || tpe === 'prep';
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
    if (this.isNew) {
      this._saveWord(form);
    } else {
      this._updateWord(form);
    }
  }

  _saveWord(form: any): void {
    this.wordService.addWord(form).then(word => {
      let wordPair: WordPair = word['word'];
      this.submitMessage = `Het woord ${wordPair['cz'].word}/${wordPair['nl'].word} is succesvol opgeslagen.`;
      this.disableSubmit = true;
      this.isNew = false;
    });
  }

  _updateWord(form: any): void {
    this.wordService.updateWord(form).then(word => {
      let wordPair: WordPair = word['word'];
      this.submitMessage = `Het woord ${wordPair['cz'].word}/${wordPair['nl'].word} is succesvol aangepast.`;
      this.disableSubmit = true;
      this.isNew = false;
    });
  }

  removeCase(ctrlName: string) {
    (<FormControl>this.wordForm.controls[ctrlName]).updateValue('');
  }

  editForm(word) {
    this._buildEditForm(word);
    this.submitMessage = '';
    this.disableSubmit = false;
  }

  resetForm() {
    //Create new word
    this._buildNewForm();
    this.submitMessage = '';
    this.disableSubmit = false;
    this.wordService.newWord();
  }

  _buildNewForm() {
    this.isNew = true;
    this.wordForm = this.formBuilder.group({
      'tpe': ['', [Validators.required]],
      'level': ['', [Validators.required]],
      'categories': [''],
      'cz.word': ['', [Validators.required]],
      'cz.genus': [''],
      'cz.case': [''],
      'cz.otherwords': [''],
      'cz.hint': [''],
      'cz.info': [''],
      'cz.firstpersonsingular': [''],
      'czP.word': [''],
      'czP.case': [''],
      'czP.otherwords': [''],
      'czP.hint': [''],
      'czP.info': [''],
      'czP.firstpersonsingular': [''],
      'nl.word': ['', [Validators.required]],
      'nl.otherwords': [''],
      'nl.hint': [''],
      'nl.info': [''],
      'nl.article': ['']
    }, {validator: this.checkOptionalValidations});
  }

  _buildEditForm(word:WordPair) {
    this.isNew = false;
    this.wordForm = this.formBuilder.group({
      '_id': [word._id],
      'tpe': [word.tpe, [Validators.required]],
      'level': [word.level, [Validators.required]],
      'categories': [word.categories],
      'cz.word': [word.cz.word, [Validators.required]],
      'cz.genus': [word.cz.genus],
      'cz.case': [word.cz.case],
      'cz.otherwords': [word.cz.otherwords],
      'cz.hint': [word.cz.hint],
      'cz.info': [word.cz.info],
      'cz.firstpersonsingular': [word.cz.firstpersonsingular],
      'czP.word': [word.czP ? word.czP.word : ''],
      'czP.case': [word.czP ? word.czP.case : ''],
      'czP.otherwords': [word.czP ? word.czP.otherwords : ''],
      'czP.hint': [word.czP ? word.czP.hint : ''],
      'czP.info': [word.czP ? word.czP.info : ''],
      'czP.firstpersonsingular': [word.czP ? word.czP.firstpersonsingular : ''],
      'nl.word': [word.nl.word, [Validators.required]],
      'nl.otherwords': [word.nl.otherwords],
      'nl.hint': [word.nl.hint],
      'nl.info': [word.nl.info],
      'nl.article': [word.nl.article]
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

  searchCats(cats: string):void {
    if (cats.length > 0) {
      this.wordService.searchCategories(cats)
        .then(words => {this.cats = words ? words.cats : [];});
    } else {
      this.cats = [];
    }
  }

  addCategory(newCat: string) {
    let cat: string[] = [];
    cat[0] = this.wordForm.controls['categories'].value;
    cat[1] = newCat;
    cat = cat.filter(c => !!c);
    (<FormControl>this.wordForm.controls['categories']).updateValue(cat.join(','));
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

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}

