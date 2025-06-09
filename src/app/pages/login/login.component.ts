import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) { }

  login() {
    if (!this.email || !this.password) return;

    this.authService.login(this.email, this.password).subscribe(res => {
      localStorage.setItem('user', this.email);
      this.router.navigate(['/']);
    }
      , error => {
        alert("Giriş başarısız: " + error.message);
      });
  }
}
