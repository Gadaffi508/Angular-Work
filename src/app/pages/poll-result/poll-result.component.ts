import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-poll-result',
  templateUrl: './poll-result.component.html',
  styleUrls: ['./poll-result.component.css']
})
export class PollResultComponent implements OnInit {
  results = [
  {
    title: 'Hangi oyun motorunu kullanıyorsunuz?',
    options: [
      { option: 'Unity', votes: 45, percentage: 45 },
      { option: 'Unreal Engine', votes: 30, percentage: 30 },
      { option: 'Godot', votes: 25, percentage: 25 }
    ]
  }
];


  constructor() {}

  ngOnInit(): void {}
}
