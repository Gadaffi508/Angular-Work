import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  email = '';
  password = '';

  constructor(private router: Router) {}

  register() {
    if (this.email && this.password) {
      localStorage.setItem('user', this.email); // kayıt sonrası giriş yapılmış gibi
      this.router.navigate(['/']);
    }
  }
}
