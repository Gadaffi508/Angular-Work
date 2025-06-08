import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'proje';

  isLoggedIn = false;

  userEmail = '';

  constructor(private router: Router) { }

  ngOnInit(): void {
    const email = localStorage.getItem('user');
    this.isLoggedIn = !!email;
    this.userEmail = email || '';
  }

  logout() {
    localStorage.removeItem('user');
    this.isLoggedIn = false;
    this.userEmail = '';
    this.router.navigate(['/']);
  }


}
