import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private router: Router) {}

  login() {
    // Şimdilik sahte giriş
    if (this.email && this.password) {
      localStorage.setItem('user', this.email);
      this.router.navigate(['/']);
    }
  }
}
