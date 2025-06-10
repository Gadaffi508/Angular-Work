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
    plugins: {
      legend: {
        display: true, // Display legend (e.g., "Oy Sayısı")
        labels: {
          color: 'white' // Make legend labels visible on dark background
        }
      }
    },
    scales: { // Ensure axes are visible on dark background
      x: {
        ticks: {
          color: 'white'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)' // Lighten grid lines
        }
      },
      y: {
        ticks: {
          color: 'white'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)' // Lighten grid lines
        }
      }
    }
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

      const firstMultipleChoiceQuestion = data.questions.find((q: any) => q.type !== 'text');

      if (firstMultipleChoiceQuestion) {
        this.barChartLabels = firstMultipleChoiceQuestion.options.map((o: any) => o.option);
        this.barChartData = [
          { data: firstMultipleChoiceQuestion.options.map((o: any) => o.votes || 0), label: 'Oy Sayısı' }
        ];
      }

      this.results = data.questions.map((q: any) => {
        if (q.type === 'text') {
          const answers = Array.isArray(q.answers) ? q.answers : [];

          const frequencyMap: { [key: string]: number } = {};
          for (const ans of answers) {
            const word = ans.toLowerCase().trim();
            frequencyMap[word] = (frequencyMap[word] || 0) + 1;
          }

          const labels = Object.keys(frequencyMap);
          const values = Object.values(frequencyMap);

          return {
            title: q.question,
            textAnswers: answers,
            isText: true,
            chartLabels: labels,
            chartData: [{
              data: values,
              label: 'Cevap Sıklığı',
              backgroundColor: 'rgba(255, 99, 132, 0.6)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1
            }]
          };
        } else {
          const totalVotes = q.options.reduce((sum: number, opt: any) => sum + (opt.votes || 0), 0);
          return {
            title: q.question,
            options: q.options.map((opt: any) => ({
              option: opt.option,
              votes: opt.votes || 0,
              percentage: totalVotes > 0 ? Math.round((opt.votes || 0) * 100 / totalVotes) : 0,
            })),
            chartLabels: (q.options || []).map((o: any) => o.option),
            chartData: [{
              data: (q.options || []).map((o: any) => o.votes || 0),
              label: 'Oy Sayısı',
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
            }]
          };
        }
      });
    });
  }

  goBack() {
    this.location.back();
  }
}