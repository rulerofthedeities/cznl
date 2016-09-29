import {Directive, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {Router} from '@angular/router';
import {AuthService} from '../services/auth.service';

@Directive({
    selector: '[protected]'
})
export class ProtectedDirective implements OnInit {

  constructor(
    private authService:AuthService,
    private router:Router,
    private location:Location
  ) {}

  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.location.replaceState('/'); // clears browser history so they can't navigate with back button
      this.router.navigate(['/auth/signin']);
    }
  }
}
