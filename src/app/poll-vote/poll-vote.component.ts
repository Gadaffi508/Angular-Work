import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PollService } from 'src/app/services/poll.service';
import { Location } from '@angular/common';

import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { switchMap } from 'rxjs';
import { forkJoin, Observable } from 'rxjs';

@Component({
  selector: 'app-poll-vote',
  templateUrl: './poll-vote.component.html'
})
export class PollVoteComponent implements OnInit {
  pollId = '';
  questions: any[] = [];
  selectedAnswers: number[] = [];

  answers: any[] = [];

  dbUrl = `${environment.firebaseUrl}/anketler`;

  constructor(
    private route: ActivatedRoute,
    private pollService: PollService,
    private location: Location,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.pollId = this.route.snapshot.paramMap.get('id')!;
    this.pollService.getPoll(this.pollId).subscribe((pollData) => {
      this.questions = pollData;
      this.answers = this.questions.map(() => '');
      this.selectedAnswers = new Array(pollData.length).fill(undefined);
    });

  }

  goBack() {
    this.location.back();
  }

  vote() {
    const incomplete = this.questions.some((q, i) => {
      const answer = this.answers[i];
      return (q.type === 'text' && (!answer || answer.trim() === '')) ||
        (q.type === 'multiple' && answer === undefined);
    });

    if (incomplete) {
      alert("Lütfen tüm sorulara cevap verin.");
      return;
    }

    const pollId = this.pollId;
    const updates: Observable<any>[] = [];

    this.questions.forEach((q, i) => {
      if (q.type === 'multiple') {
        const optionIndex = this.answers[i];
        const voteUrl = `${this.dbUrl}/${pollId}/${i}/options/${optionIndex}/votes.json`;

        updates.push(
          this.http.get<number>(voteUrl).pipe(
            switchMap(votes => {
              const updated = (votes || 0) + 1;
              return this.http.put(voteUrl, updated);
            })
          )
        );
      } else if (q.type === 'text') {
        const answerText = this.answers[i];
        const answerUrl = `${this.dbUrl}/${pollId}/${i}/answers.json`;

        updates.push(
          this.http.get<string[]>(answerUrl).pipe(
            switchMap(answers => {
              const updated = answers ? [...answers, answerText] : [answerText];
              return this.http.put(answerUrl, updated);
            })
          )
        );
      }
    });

    forkJoin(updates).subscribe(() => {
      this.router.navigate(['/results', pollId]);
    });
  }

}