import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PollService } from 'src/app/services/poll.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-poll-result',
  templateUrl: './poll-result.component.html',
  styleUrls: ['./poll-result.component.css']
})
export class PollResultComponent implements OnInit {
  results: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private pollService: PollService,
    private location: Location
  ) { }

  goBack() {
    this.location.back();
  }

  ngOnInit(): void {
  const pollId = this.route.snapshot.paramMap.get('id');
  if (!pollId) return;

  this.pollService.getPoll(pollId).subscribe((pollData) => {
    this.results = pollData.map((q: any) => {
      if (q.type === 'text') {
        return {
          title: q.question,
          textAnswers: q.answers || []
        };
      } else {
        const totalVotes = q.options.reduce((sum: number, opt: any) => sum + (opt.votes || 0), 0);
        return {
          title: q.question,
          options: q.options.map((opt: any) => ({
            option: opt.option,
            votes: opt.votes || 0,
            percentage: totalVotes > 0 ? Math.round((opt.votes || 0) * 100 / totalVotes) : 0
          }))
        };
      }
    });
  });
}

}
