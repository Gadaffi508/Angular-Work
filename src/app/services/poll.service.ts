// src/app/services/poll.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PollService {
  private dbUrl = `${environment.firebaseUrl}/anketler`;

  constructor(private http: HttpClient) { }

  registerUser(user: { email: string, password: string }) {
    return this.http.post(`${this.dbUrl}/users.json`, user);
  }

  loginUser(email: string, password: string): Observable<any> {
    return this.http.get<{ [key: string]: any }>(`${this.dbUrl}/users.json`).pipe(
      map(users => {
        const matched = Object.entries(users || {}).find(([key, val]: any) =>
          val.email === email && val.password === password
        );
        return matched ? matched[1] : null;
      })
    );
  }


  getPolls(): Observable<any> {
    return this.http.get(`${this.dbUrl}.json`);
  }

  createPoll(poll: any): Observable<any> {
    return this.http.post(`${this.dbUrl}.json`, poll);
  }

  vote(pollId: string, questionIndex: number, optionIndex: number): Observable<any> {
    const voteUrl = `${this.dbUrl}/${pollId}/${questionIndex}/options/${optionIndex}/votes.json`;

    return this.http.get<number>(voteUrl).pipe(
      switchMap((votes: number) => {
        const updated = (votes || 0) + 1;
        return this.http.put(voteUrl, updated);
      })
    );
  }

  getPollById(id: string): Observable<any> {
    return this.http.get(`${this.dbUrl}/${id}.json`);
  }

  getPoll(pollId: string): Observable<any> {
    return this.http.get(`${this.dbUrl}/${pollId}.json`);
  }

}