import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PollService } from 'src/app/services/poll.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-create-poll',
  templateUrl: './create-poll.component.html',
  styleUrls: ['./create-poll.component.css']
})
export class CreatePollComponent implements OnInit {

  polls = [
    {
      question: '',
      type: 'text',
      options: ['']
    }
  ];

  pollId: string | null = null;

  constructor(private pollService: PollService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.pollId = this.route.snapshot.paramMap.get('id');
    if (this.pollId) {
      this.pollService.getPoll(this.pollId).subscribe((poll: any) => {
        this.polls = poll.questions.map((q: any) => ({
          question: q.question,
          type: q.type,
          options: q.type === 'text'
            ? ['']
            : q.options.map((opt: any) => typeof opt === 'string' ? opt : opt.option)
        }));
      });

    }
  }

  addQuestion() {
    this.polls.push({
      question: '',
      type: 'multiple',
      options: ['', '']
    });
  }

  trackByIndex(index: number, item: any): any {
    return index;
  }

  savePoll() {
    const anketSorulari = this.polls.map(p => ({
      question: p.question,
      type: p.type,
      options: p.type === 'text'
        ? []
        : (p.options as any[]).map((opt: any) => {
          if (typeof opt === 'string') {
            return { option: opt.trim(), votes: 0 };
          } else if (typeof opt === 'object' && opt.option) {
            return { option: String(opt.option).trim(), votes: Number(opt.votes) || 0 };
          } else {
            return { option: '', votes: 0 };
          }
        }).filter(opt => opt.option !== '')
    }));

    if (this.pollId) {
      this.pollService.updatePoll(this.pollId, anketSorulari).subscribe(() => {
        alert('Anket güncellendi!');
        this.router.navigate(['/profile']);
      });
    } else {
      this.pollService.createPoll(anketSorulari).subscribe(() => {
        alert('Anket oluşturuldu!');
        this.router.navigate(['/polls']);
      }, (error) => {
        console.error('Anket oluşturma hatası:', error);
        alert('Anket oluşturulurken bir hata oluştu.');
      });
    }
  }





  addOption(questionIndex: number) {
    this.polls[questionIndex].options.push('');
  }
}