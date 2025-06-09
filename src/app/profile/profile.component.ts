import { Component, OnInit } from '@angular/core';
import { PollService } from 'src/app/services/poll.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  createdPolls: any[] = [];
  votedPolls: any[] = [];
  userEmail: string = '';

  constructor(private pollService: PollService) { }

  ngOnInit(): void {
    this.userEmail = localStorage.getItem('user') || '';

    this.pollService.getMyPolls().subscribe(data => {
      this.createdPolls = data;
    });

    this.pollService.getMyVotedPolls().subscribe(data => {
      this.votedPolls = data;
    });
  }


}
