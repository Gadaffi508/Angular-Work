import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-poll-list',
  templateUrl: './poll-list.component.html',
  styleUrls: ['./poll-list.component.css']
})
export class PollListComponent implements OnInit {

  isLoggedIn = false;

  polls = [
    {
      title: 'En iyi oyun motoru hangisi?',
      description: 'Unity, Unreal, Godot arasında hangisini tercih ediyorsunuz?',
      endDate: '2025-06-30'
    },
    {
      title: 'Yapay zekâ faydalı mı?',
      description: 'Günlük yaşamda AI’ın yeri hakkında ne düşünüyorsunuz?',
      endDate: '2025-07-10'
    }
  ];

  constructor() { }

  ngOnInit(): void {
    this.isLoggedIn = !!localStorage.getItem('user');
  }
}