import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'proje';

  isLoggedIn = false;

  ngOnInit(): void {
    this.isLoggedIn = !!localStorage.getItem('user');
  }

  logout() {
    localStorage.removeItem('user');
    location.reload(); // sayfa yenile
  }
}
