import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PollService } from 'src/app/services/poll.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private router: Router, private pollService: PollService) { }

  login() {
    if (!this.email || !this.password) return;

    this.pollService.loginUser(this.email, this.password).subscribe(user => {
      if (user) {
        localStorage.setItem('user', this.email);
        window.location.reload();
      } else {
        alert('Hatalı email ya da şifre!');
      }
    });
  }

}
