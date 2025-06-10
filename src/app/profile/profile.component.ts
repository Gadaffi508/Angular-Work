import { Component, OnInit } from '@angular/core';
import { PollService } from 'src/app/services/poll.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ChartType, ChartConfiguration, ChartData } from 'chart.js';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  createdPolls: any[] = [];
  votedPolls: any[] = [];
  userEmail: string = '';

  createdLoaded = false;
  votedLoaded = false;


  public doughnutChartData: ChartData<'doughnut'> = {
    labels: ['Oluşturduğum Anketler', 'Katıldığım Anketler'],
    datasets: [
      {
        data: [0, 0],
        backgroundColor: ['#36A2EB', '#4BC0C0'],
        hoverBackgroundColor: ['#36A2EBAA', '#4BC0C0AA']
      }
    ]
  };

  public doughnutChartType: ChartType = 'doughnut';

  public doughnutChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: 'white'
        }
      }
    }
  };

  constructor(private pollService: PollService, private router: Router) { }

  goToResult(pollId: string) {
    this.router.navigate(['/poll-result', pollId]);
  }

  editPoll(pollId: string) {
    this.router.navigate(['/edit', pollId]);
  }

  confirmDelete(pollId: string): void {
    if (confirm("Bu anketi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.")) {
      this.deletePoll(pollId);
    }
  }

  private deletePoll(pollId: string): void {
    this.pollService.deletePoll(pollId).subscribe({
      next: () => {
        alert('Anket başarıyla silindi.');

        this.createdPolls = this.createdPolls.filter(p => p.id !== pollId);
      },
      error: (err) => {
        console.error('Anket silinirken hata oluştu:', err);
        alert('Anket silinirken bir hata oluştu.');
      }
    });
  }

  ngOnInit(): void {
    const email = localStorage.getItem('user');
    if (!email) return;

    this.userEmail = email;

    this.pollService.getMyPolls().subscribe(data => {
      this.createdPolls = data;
      this.createdLoaded = true;
      this.tryUpdateChart();
      console.log('Oluşturduğum anketler:', data);
    });

    this.pollService.getMyVotedPolls().subscribe(data => {
      this.votedPolls = data;
      this.votedLoaded = true;
      this.tryUpdateChart();
      console.log('Katıldığım anketler:', data);
    });
  }

  tryUpdateChart(): void {
    if (this.createdLoaded && this.votedLoaded) {
      this.doughnutChartData = {
        labels: ['Oluşturduğum Anketler', 'Katıldığım Anketler'],
        datasets: [
          {
            data: [this.createdPolls.length, this.votedPolls.length],
            backgroundColor: ['#36A2EB', '#4BC0C0'],
            hoverBackgroundColor: ['#36A2EBAA', '#4BC0C0AA']
          }
        ]
      };
    }
  }

}
