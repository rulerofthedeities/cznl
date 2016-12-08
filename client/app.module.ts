import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {TooltipModule} from 'ng2-tooltip';

import {routing} from './routes';

import {AppComponent} from './components/app.component';
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
import {CardItemQuestion} from './components/cards/card-item-question.component';
import {CardItemAnswer} from './components/cards/card-item-answer.component';
import {CardScore} from './components/cards/card-score.component';
import {ScoreBar} from './components/cards/score-bar.component';
import {InfoMessage} from './components/msg/info-message.component';
import {ErrorMessage} from './components/msg/error-message.component';
import {FieldMessages} from './components/msg/field-messages.component';
import {AuthMenu} from './components/auth/auth-menu.component';
import {SignUp} from './components/auth/sign-up.component';
import {SignIn} from './components/auth/sign-in.component';

import {GetFilterValue} from './directives/get-filter-value.directive';
import {GetKeyPress} from './directives/get-key-pressed.directive';
import {GenusColor} from './directives/show-color.directive';

import {AccessResolver} from './resolves/access.resolver';

import {LevelNamePipe} from './pipes/level-name.pipe';

import {AuthService} from './services/auth.service';
import {AuthGuard} from './services/auth-guard.service';
import {AuthRoleGuard} from './services/auth-role-guard.service';
import {WordService} from './services/words.service';
import {WordlistService} from './services/wordlists.service';
import {SettingsService} from './services/settings.service';
import {FilterService} from './services/filters.service';
import {RestartService} from './services/restart.service';
import {ErrorService} from './services/error.service';
import {UtilsService} from './services/utils.service';
import {ValidationService} from './services/validation.service';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    routing,
    TooltipModule
  ],
  providers: [
    WordService,
    WordlistService,
    SettingsService,
    FilterService,
    RestartService,
    ErrorService,
    AuthService,
    AuthGuard,
    AuthRoleGuard,
    UtilsService,
    ValidationService,
    AccessResolver
  ],
  declarations: [
    AppComponent,
    AppSettings,
    Menu,
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
    CardItemQuestion,
    CardItemAnswer,
    CardScore,
    ScoreBar,
    InfoMessage,
    ErrorMessage,
    FieldMessages,
    GetFilterValue,
    GetKeyPress,
    GenusColor,
    LevelNamePipe,
    AuthMenu,
    SignIn,
    SignUp
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
