import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PollService } from 'src/app/services/poll.service';

interface Question {
  question: string;
  options: { option: string; votes: number }[];
}

@Component({
  selector: 'app-poll-list',
  templateUrl: './poll-list.component.html',
  styleUrls: ['./poll-list.component.css']
})
export class PollListComponent implements OnInit {

  isLoggedIn = false;

  polls: any[] = [];

  results: any[] = [];

  constructor(private pollService: PollService, private route: ActivatedRoute) { }


  ngOnInit(): void {
    this.isLoggedIn = !!localStorage.getItem('user');

    this.pollService.getPolls().subscribe((data) => {
      this.polls = [];

      for (const [key, sorularRaw] of Object.entries(data || {})) {
        const sorular = sorularRaw as Question[];
        const firstQuestion = sorular[0];

        this.polls.push({
          id: key,
          title: firstQuestion?.question || 'Başlıksız',
          description: `${sorular.length} sorudan oluşuyor.`,
          endDate: '2025-07-01',
          options: firstQuestion.options || [],
          selectedOption: undefined
        });
      }
    });

  }



  vote(pollId: string, questionIndex: number, selectedIndex: number) {
    if (selectedIndex === undefined) {
      alert("Lütfen bir seçenek seçin.");
      return;
    }

    this.pollService.vote(pollId, questionIndex, selectedIndex).subscribe(() => {
      alert('Oy kaydedildi!');
    });
  }

}