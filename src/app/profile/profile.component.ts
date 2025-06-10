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
  if(!email) return;

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
