import {} from 'jasmine';
import {TestBed, async, ComponentFixture} from '@angular/core/testing';
import {HttpModule} from '@angular/http';
import {RouterTestingModule} from '@angular/router/testing';
import {AppComponent} from './app.component';
import {MenuComponent} from './menu.component';
import {LevelNamePipe} from '../pipes/level-name.pipe';
import {AuthService} from '../services/auth.service';
import {ErrorService} from '../services/error.service';
import {TestService} from '../services/test.service';

describe('AppComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent, MenuComponent, LevelNamePipe],
      providers: [AuthService, ErrorService, TestService],
      imports: [RouterTestingModule, HttpModule]
    });
    TestBed.compileComponents();
  });

  let app: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
  });

  it('should create the app', async(() => {
    expect(app).toBeTruthy();
  }));

});
