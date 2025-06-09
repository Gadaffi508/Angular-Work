import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PollService } from 'src/app/services/poll.service';

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

  constructor(private pollService: PollService, private router: Router) { }

  ngOnInit(): void { }

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
        : p.options.map(opt => ({ option: opt, votes: 0 }))
    }));

    this.pollService.createPoll(anketSorulari).subscribe(() => {
      alert('Anket oluşturuldu!');
      this.router.navigate(['/polls']);
    });

  }



  addOption(questionIndex: number) {
    this.polls[questionIndex].options.push('');
  }
}