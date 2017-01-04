import {Component, OnInit, OnDestroy, EventEmitter, Output} from '@angular/core';
import {FilterService} from '../services/filters.service';
import {WordService} from '../services/words.service';
import {AuthService} from '../services/auth.service';
import {ErrorService} from '../services/error.service';
import {ErrorObject} from '../models/word.model';
import {WordPair} from '../models/word.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import 'rxjs/add/operator/takeWhile';

@Component({
  selector: 'edit-word',
  templateUrl:'/client/components/edit-word.component.html',
  styles:[`
    input.ng-dirty.warning {
      border: 1px dotted orange;
      border-left: 5px solid orange;
    }
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
  @Output() updatedWord = new EventEmitter<WordPair>();
  wordForm: FormGroup;
  filters: Object;
  submitMessage: string;
  cats: string[];
  isNew: boolean = true;
  filtersLoaded: boolean = false;
  disableSubmit: boolean = false;
  wordAlreadyExists: boolean = false;
  componentActive: boolean = true;

  constructor(
    private filterService: FilterService,
    private wordService: WordService,
    private errorService: ErrorService,
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this._getFilterOptions();
    this._buildForm();
    this.wordService.editWordSource$
    .takeWhile(() => this.componentActive)
    .subscribe(
      word => {
        this.editForm(word);
      }
    );
  }

  isNoun() {
    return this.wordForm.controls['tpe'].value === 'noun';
  }

  isVerb(perfectOnly: boolean = false): boolean {
    const isVerb = this.wordForm.controls['tpe'].value === 'verb';
    const isImperfective = this.wordForm.controls['perfective'].value !== true;
    let isVerbReturn = isVerb;

    if (perfectOnly) {
      //The verb only has a perfective aspect
      isVerbReturn = isVerbReturn && isImperfective;
    }

    return isVerbReturn;
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
    if (this.isNew) {
      this._saveWord(form);
    } else {
      this._updateWord(form);
    }
  }

  onChange() {
    this.wordAlreadyExists = false;
    if (this.isNew) {
      this.wordService
      .checkIfWordExists(this.wordForm.controls['cz.word'].value)
      .takeWhile(() => this.componentActive)
      .subscribe(
        itExists => this.wordAlreadyExists = itExists,
        error => this.errorService.handleError(error)
      );
    }
  }

  _saveWord(form: any): void {
    this.wordService
    .addWord(form)
    .takeWhile(() => this.componentActive)
    .subscribe(
      wordPair => {
        this.submitMessage = `Het woord ${wordPair.cz.word}/${wordPair.nl.word} is succesvol opgeslagen.`;
        this.disableSubmit = true;
        this.isNew = false;
        this.wordForm.patchValue({_id: wordPair._id});

      },
      error => this.errorService.handleError(error)
    );
  }

  _updateWord(form: any): void {
    this.wordService
    .updateWord(form)
    .takeWhile(() => this.componentActive)
    .subscribe(
      wordPair => {
        this.submitMessage = `Het woord ${wordPair.cz.word}/${wordPair.nl.word} is succesvol aangepast.`;
        this.disableSubmit = true;
        this.isNew = false;
        this.updatedWord.emit(wordPair);
      },
      error => this.errorService.handleError(error)
    );
  }

  removeCase(ctrlName: string) {
    this.wordForm.patchValue({ctrlName: ''});
  }

  editForm(word) {
    this.isNew = false;
    this._buildForm(word);
    this.submitMessage = '';
    this.disableSubmit = false;
  }

  resetForm() {
    //Create new word
    this.isNew = true;
    this.wordAlreadyExists = false;
    this._buildForm();
    this.submitMessage = '';
    this.disableSubmit = false;
    this.wordService.newWord();
  }

  _buildForm(word?:WordPair) {
    this.wordForm = this.formBuilder.group({
      '_id': [word ? word._id : ''],
      'tpe': [word ? word.tpe : '', [Validators.required]],
      'level': [word ? word.level : '', [Validators.required]],
      'perfective': [word ? word.perfective : ''],
      'categories': [word ? word.categories : ''],
      'cz.word': [word ? word.cz.word : '', [Validators.required]],
      'cz.genus': [word ? word.cz.genus : ''],
      'cz.plural': [word ? word.cz.plural : ''],
      'cz.case': [word ? word.cz.case : ''],
      'cz.otherwords': [word ? word.cz.otherwords : ''],
      'cz.hint': [word ? word.cz.hint : ''],
      'cz.info': [word ? word.cz.info : ''],
      'cz.firstpersonsingular': [word ? word.cz.firstpersonsingular : ''],
      'czP.word': [word && word.czP ? word.czP.word : ''],
      'czP.case': [word && word.czP ? word.czP.case : ''],
      'czP.otherwords': [word && word.czP ? word.czP.otherwords : ''],
      'czP.hint': [word && word.czP ? word.czP.hint : ''],
      'czP.info': [word && word.czP ? word.czP.info : ''],
      'czP.firstpersonsingular': [word && word.czP ? word.czP.firstpersonsingular : ''],
      'nl.word': [word ? word.nl.word : '', [Validators.required]],
      'nl.otherwords': [word ? word.nl.otherwords : ''],
      'nl.hint': [word ? word.nl.hint : ''],
      'nl.info': [word ? word.nl.info : ''],
      'nl.article': [word ? word.nl.article : ''],
      'nlP.word': [word && word.nlP ? word.nlP.word : ''],
      'nlP.otherwords': [word && word.nlP ? word.nlP.otherwords : ''],
      'nlP.hint': [word && word.nlP ? word.nlP.hint : ''],
      'nlP.info': [word && word.nlP ? word.nlP.info : ''],
    }, {validator: this.checkOptionalValidations});
  }

  _getFilterOptions() {
    this.filterService
    .getFilterOptions()
    .takeWhile(() => this.componentActive)
    .subscribe(
      filters => {
        this.filters = filters;
        this.filtersLoaded = true;
      }
    );
  }

  searchCats(cats: string):void {
    if (cats.length > 0) {
      this.wordService
      .searchCategories(cats)
      .takeWhile(() => this.componentActive)
      .subscribe(
        cats => {this.cats = cats || [];},
        error => this.errorService.handleError(error)
      );
    } else {
      this.cats = [];
    }
  }

  addCategory(newCat: string) {
    let cat: string[] = [];
    cat[0] = this.wordForm.controls['categories'].value;
    cat[1] = newCat;
    cat = cat.filter(c => !!c);
    this.wordForm.patchValue({categories: cat.join(',')});
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
    this.componentActive = false;
  }
}

