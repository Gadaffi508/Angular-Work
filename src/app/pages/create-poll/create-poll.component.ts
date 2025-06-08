import { Component, OnInit } from '@angular/core';
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
      type: 'multiple', // 'multiple', 'text', 'checkbox'
      options: ['', '']
    }
  ];

  constructor(private pollService: PollService) { }

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
  const anket = this.polls.map(p => ({
    question: p.question,
    type: p.type,
    options: p.type === 'text'
      ? []
      : p.options.map(opt => ({ option: opt, votes: 0 }))
  }));

  this.pollService.createPoll(anket).subscribe(() => {
    alert('Anket başarıyla kaydedildi.');
  });
}


  addOption(questionIndex: number) {
    this.polls[questionIndex].options.push('');
  }
}