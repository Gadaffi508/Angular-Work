import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PollService } from 'src/app/services/poll.service';
import { Location } from '@angular/common';
import { ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'app-poll-result',
  templateUrl: './poll-result.component.html',
  styleUrls: ['./poll-result.component.css']
})
export class PollResultComponent implements OnInit {
  results: any[] = [];

  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
  };
  barChartLabels: string[] = [];
  barChartData: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private pollService: PollService,
    private location: Location
  ) { }

  ngOnInit(): void {
    const pollId = this.route.snapshot.paramMap.get('id')!;
    if (!pollId) return;

    this.pollService.getPoll(pollId).subscribe((data: any) => {
      this.results = data.questions.map((q: any) => {
        if (q.type === 'text') {
          return {
            title: q.question,
            textAnswers: Array.isArray(q.answers) ? q.answers : []
          };
        } else {
          const totalVotes = q.options.reduce((sum: number, opt: any) => sum + (opt.votes || 0), 0);
          const question = data.questions[0];
          this.barChartLabels = question.options.map((o: any) => o.option);
          this.barChartData = [
            { data: question.options.map((o: any) => o.votes || 0), label: 'Oy Sayısı' }
          ];
          return {
            title: q.question,
            options: q.options.map((opt: any) => ({
              option: opt.option,
              votes: opt.votes || 0,
              percentage: totalVotes > 0 ? Math.round((opt.votes || 0) * 100 / totalVotes) : 0,
            }))
          };
        }
      });
    });
  }

  goBack() {
    this.location.back();
  }
}