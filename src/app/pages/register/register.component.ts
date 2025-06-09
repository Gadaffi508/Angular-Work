import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  email = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) { }

  register() {
    if (!this.email || !this.password) return;

    this.authService.register(this.email, this.password).subscribe(() => {
      localStorage.setItem('user', this.email);
      this.router.navigate(['/']);
    }, error => {
      alert("Kayıt başarısız: " + error.message);
    });
  }
}