import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { CommonModule } from '@angular/common';
import { PollService } from './services/poll.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'proje';
  isLoggedIn = false;
  userEmail = '';
  searchTerm = '';

  constructor(private authService: AuthService, private router: Router, private pollService: PollService) { }

  ngOnInit(): void {
    const email = localStorage.getItem('user');
    this.isLoggedIn = !!email;
    this.userEmail = email || '';
  }

  onSearchLive() {
    this.pollService.updateSearchTerm(this.searchTerm);
  }

  onSearch(event: Event) {
    event.preventDefault();
    this.pollService.updateSearchTerm(this.searchTerm);
  }

  ngDoCheck(): void {
    const email = localStorage.getItem('user');
    this.isLoggedIn = !!email;
    this.userEmail = email || '';
  }

  goAccount() {
    this.router.navigate(['/hesabim'])
  }


  logout() {
    this.authService.logout().subscribe(() => {
      localStorage.removeItem('user');
      this.isLoggedIn = false;
      this.userEmail = '';
      this.router.navigate(['/']);
    });
  }
}
