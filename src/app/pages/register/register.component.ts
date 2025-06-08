import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PollService } from 'src/app/services/poll.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  email = '';
  password = '';

  constructor(private router: Router, private pollService: PollService) { }

  register() {
    if (!this.email || !this.password) return;

    this.pollService.registerUser({ email: this.email, password: this.password }).subscribe(() => {
      localStorage.setItem('user', this.email);
      window.location.reload();
    });
  }
}
