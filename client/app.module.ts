import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import {HttpModule} from '@angular/http';

import {routing} from './routes';

import {AppComponent} from './components/app.component';
import {Dashboard} from './components/dashboard.component';
import {WordBank} from './components/wordbank.component';
import {AppSettings} from './components/settings.component';
import {Menu} from './components/menu.component';
import {Tests} from './components/tests.component';
import {Filter} from './components/filter.component';
import {Cards} from './components/cards/cards.component';
import {Review} from './components/review.component';
import {EditWord} from './components/edit-word.component';
import {WordLists} from './components/wordlists/wordlists.component';
import {AddToList} from './components/wordlists/add-to-list.component';
import {EditList} from './components/wordlists/edit-list.component';
import {ShowLists} from './components/wordlists/show-lists.component';
import {CardItem} from './components/cards/card-item.component';
import {CardScore} from './components/cards/card-score.component';
import {InfoMessage} from './components/common/info-message.component';

import {GetFilterValue} from './directives/get-filter-value.directive';
import {GetKeyPress} from './directives/get-key-pressed.directive';
import {GenusColor} from './directives/show-color.directive';

import {WordService} from './services/words.service';
import {WordlistService} from './services/wordlists.service';
import {SettingsService} from './services/settings.service';
import {FilterService} from './services/filters.service';
import {RestartService} from './services/restart.service';


@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    routing
  ],
  providers: [
    WordService,
    WordlistService,
    SettingsService,
    FilterService,
    RestartService,
    {provide: LocationStrategy, useClass: HashLocationStrategy}
  ],
  declarations: [
    AppComponent,
    AppSettings,
    Menu,
    Dashboard,
    WordBank,
    Tests,
    Filter,
    Cards,
    Review,
    WordLists,
    EditWord,
    AddToList,
    EditList,
    ShowLists,
    CardItem,
    CardScore,
    InfoMessage,
    GetFilterValue,
    GetKeyPress,
    GenusColor
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
