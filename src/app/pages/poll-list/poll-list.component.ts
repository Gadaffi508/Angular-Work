import { Component, DoCheck, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PollService } from 'src/app/services/poll.service';

@Component({
  selector: 'app-poll-list',
  templateUrl: './poll-list.component.html',
  styleUrls: ['./poll-list.component.css']
})
export class PollListComponent implements OnInit, DoCheck {
  isLoggedIn = false;
  polls: any[] = [];
  filteredPolls: any[] = [];
  loading = true;

  constructor(private pollService: PollService, private router: Router) { }

  ngOnInit(): void {
    this.pollService.getPolls().subscribe((data) => {
      this.polls = data;
      this.filteredPolls = data;
      this.loading = false;

      this.pollService.searchTerm$.subscribe(term => {
        const trimmedTerm = term.trim().toLowerCase();
        this.filteredPolls = trimmedTerm
          ? this.polls.filter(p => p.title.toLowerCase().includes(trimmedTerm))
          : this.polls;
      });
    });

    this.isLoggedIn = !!localStorage.getItem('user');
  }

  ngDoCheck(): void {
    this.isLoggedIn = !!localStorage.getItem('user');
  }

  goToResult(id: string) {
    this.router.navigate(['/poll-result', id]);
  }
}
