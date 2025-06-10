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
    const currentUserEmail = localStorage.getItem('user');
    this.pollService.getPoll(this.pollId).subscribe((pollData) => {
      if (pollData.votedBy && pollData.votedBy.includes(currentUserEmail)) {
        alert("Bu ankete daha önce oy verdiniz. Sonuçlar sayfasına yönlendiriliyorsunuz.");
        this.router.navigate(['/results', this.pollId]);
        return; // Component'in geri kalanının çalışmasını engelle
      }
      this.questions = pollData.questions;
      this.answers = this.questions.map(() => '');
    });
  }

  onCheckboxChange(qi: number, oi: number, event: any) {
    if (!this.answers[qi]) this.answers[qi] = [];

    if (event.target.checked) {
      this.answers[qi].push(oi);
    } else {
      const index = this.answers[qi].indexOf(oi);
      if (index >= 0) {
        this.answers[qi].splice(index, 1);
      }
    }
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
