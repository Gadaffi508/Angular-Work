import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PollService } from 'src/app/services/poll.service';

@Component({
  selector: 'app-poll-list',
  templateUrl: './poll-list.component.html',
  styleUrls: ['./poll-list.component.css']
})
export class PollListComponent implements OnInit {
  isLoggedIn = false;
  polls: any[] = [];

  constructor(private pollService: PollService,private router:Router) { }

  ngOnInit(): void {
    this.isLoggedIn = !!localStorage.getItem('user');

    this.pollService.getPolls().subscribe((data) => {
      this.polls = data;
    });
  }

  goToResult(id: string) {
  this.router.navigate(['/poll-result', id]);
}
}