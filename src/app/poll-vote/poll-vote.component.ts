import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PollService } from 'src/app/services/poll.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-poll-vote',
  templateUrl: './poll-vote.component.html'
})
export class PollVoteComponent implements OnInit {
  pollId = '';
  questions: any[] = [];
  answers: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private pollService: PollService,
    private location: Location,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.pollId = this.route.snapshot.paramMap.get('id')!;
    this.pollService.getPoll(this.pollId).subscribe((pollData) => {
      this.questions = pollData.questions;
      this.answers = this.questions.map(() => '');
    });
  }

  goBack() {
    this.location.back();
  }

  vote() {
    const incomplete = this.questions.some((q, i) => {
      const answer = this.answers[i];
      return (q.type === 'text' && (!answer || answer.trim() === '')) ||
        (q.type !== 'text' && answer === '');
    });

    if (incomplete) {
      alert("Lütfen tüm sorulara cevap verin.");
      return;
    }

    const votes = this.questions.map((q, i) => ({
      questionIndex: i,
      answer: this.answers[i]
    }));

    let counter = 0;

    votes.forEach(vote => {
      this.pollService.vote(this.pollId, vote.questionIndex, vote.answer).subscribe(() => {
        counter++;
        if (counter === votes.length) {
          this.router.navigate(['/results', this.pollId]);
        }
      });
    });
  }
}
