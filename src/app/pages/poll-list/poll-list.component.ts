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
  filteredPolls: any[] = [];

  constructor(private pollService: PollService, private router: Router) { }

  ngOnInit(): void {
  this.pollService.getPolls().subscribe((data) => {
    this.polls = data;
    this.filteredPolls = data;

    this.pollService.searchTerm$.subscribe(term => {
      const trimmedTerm = term.trim().toLowerCase();

      // Trimli terim yoksa tüm anketleri göster
      if (!trimmedTerm) {
        this.filteredPolls = this.polls;
      } else {
        this.filteredPolls = this.polls.filter(poll =>
          poll.title.toLowerCase().includes(trimmedTerm)
        );
      }
    });
  });

  this.isLoggedIn = !!localStorage.getItem('user');
}




  goToResult(id: string) {
    this.router.navigate(['/poll-result', id]);
  }
}