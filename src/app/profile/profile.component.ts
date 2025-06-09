import { Component, OnInit } from '@angular/core';
import { PollService } from 'src/app/services/poll.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  createdPolls: any[] = [];
  votedPolls: any[] = [];
  userEmail: string = '';

  constructor(private pollService: PollService, private router: Router) { }

  goToResult(pollId: string) {
    this.router.navigate(['/poll-result', pollId]);
  }

  ngOnInit(): void {
    const email = localStorage.getItem('user');
    if (!email) return;

    this.userEmail = email;

    this.pollService.getMyPolls().subscribe(data => {
      this.createdPolls = data;
      console.log('Oluşturduğum anketler:', data);
    });

    this.pollService.getMyVotedPolls().subscribe(data => {
      this.votedPolls = data;
      console.log('Katıldığım anketler:', data);
    });
  }



}
