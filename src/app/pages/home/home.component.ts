import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  isLoggedIn = false;

  constructor() { }

  ngOnInit(): void {
    this.isLoggedIn = !!localStorage.getItem('user');
  }

}
