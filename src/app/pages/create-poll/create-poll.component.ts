import { Component, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit(): void { }

  addQuestion() {
    this.polls.push({
      question: '',
      type: 'multiple',
      options: ['', '']
    });
  }

  addOption(questionIndex: number) {
    this.polls[questionIndex].options.push('');
  }
}