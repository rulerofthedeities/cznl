import {Component} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  template: `
    <div class="container">
      <div class="well">
        <h1><span class="fa fa-exclamation-triangle"></span> Pagina niet gevonden</h1>
        <p>De opgevraagde pagina bestaat niet.</p>
        <p>
          <a class="btn btn-default btn-lg" href="#" onclick="history.back(); return false;">
            <span class="fa fa-arrow-left"></span> Keer terug
          </a>
          <a class="btn btn-default btn-lg" (click)="toHomePage()">
            <span class="fa fa-home"></span> Naar homepage
          </a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .well {
      margin: 50px auto;
      text-align: center;
      padding: 25px;
      max-width: 600px;
    }
    h1, h2, h3, p {
      margin: 0;
    }
    h1 {
      color: red;
    }
    p {
      font-size: 17px;
      margin-top: 25px;
    }
    p a.btn {
      margin: 0 5px;
    }
    h1 .fa {
      vertical-align: -5%;
      margin-right: 5px;
    }
  `]
})

export class PageNotFoundComponent {

  constructor (private router: Router) {}

  toHomePage() {
    this.router.navigate(['/']);
  }
}
