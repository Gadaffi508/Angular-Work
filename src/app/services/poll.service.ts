import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { from, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PollService {

  constructor(private firestore: AngularFirestore) { }

  private searchTermSubject = new BehaviorSubject<string>('');
  searchTerm$ = this.searchTermSubject.asObservable();

  createPoll(questions: any[]): Observable<any> {
    const poll = {
      questions,
      createdAt: new Date(),
      createdBy: localStorage.getItem('user')
    };
    return from(this.firestore.collection('polls').add(poll));
  }

  deletePoll(pollId: string): Observable<void> {
    return from(this.firestore.collection('polls').doc(pollId).delete());
  }

  updateSearchTerm(term: string) {
    this.searchTermSubject.next(term.toLowerCase());
  }

  updatePoll(pollId: string, questions: any[]): Observable<any> {
    return from(this.firestore.collection('polls').doc(pollId).update({ questions }));
  }

  getPollsCreatedBy(email: string): Observable<any[]> {
    return this.firestore.collection('polls', ref => ref.where('createdBy', '==', email))
      .snapshotChanges()
      .pipe(map(snaps => snaps.map(snap => ({
        id: snap.payload.doc.id,
        ...snap.payload.doc.data() as any
      }))));
  }

  getPollsVotedBy(email: string): Observable<any[]> {
    return this.firestore.collection('polls', ref => ref.where('votedBy', 'array-contains', email))
      .snapshotChanges()
      .pipe(map(snaps => snaps.map(snap => ({
        id: snap.payload.doc.id,
        ...snap.payload.doc.data() as any
      }))));
  }


  getPolls(): Observable<any[]> {
  return this.firestore.collection('polls').snapshotChanges().pipe(
    map(snaps => snaps.map(snap => {
      const data: any = snap.payload.doc.data();
      const firstQuestion = Array.isArray(data.questions) && data.questions.length > 0 ? data.questions[0] : null;

      return {
        id: snap.payload.doc.id,
        title: firstQuestion?.question || 'Anket',
        description: `${data.questions?.length || 0} sorudan oluşuyor.`,
        endDate: '2025-07-01',
        options: Array.isArray(firstQuestion?.options) ? firstQuestion.options : []
      };
    }))
  );
}


  getPoll(id: string): Observable<any> {
    return this.firestore.collection('polls').doc(id).valueChanges();
  }

  vote(pollId: string, questionIndex: number, selectedIndexOrText: any): Observable<any> {
    const pollRef = this.firestore.collection('polls').doc(pollId);
    const userEmail = localStorage.getItem('user');

    return new Observable(observer => {
      pollRef.get().subscribe(snapshot => {
        const pollData: any = snapshot.data();
        if (!pollData) {
          observer.error('Anket verisi bulunamadı.');
          return;
        }

        const updatedQuestions = [...pollData.questions];
        const votedBy = pollData.votedBy || [];

        if (updatedQuestions[questionIndex].type === 'text') {
          if (!updatedQuestions[questionIndex].answers) {
            updatedQuestions[questionIndex].answers = [];
          }
          updatedQuestions[questionIndex].answers.push(selectedIndexOrText);
        } else {
          updatedQuestions[questionIndex].options[selectedIndexOrText].votes++;
        }

        if (!votedBy.includes(userEmail)) {
          votedBy.push(userEmail);
        }

        pollRef.update({
          questions: updatedQuestions,
          votedBy
        }).then(() => {
          observer.next(true);
          observer.complete();
        }).catch(error => observer.error(error));
      }, error => observer.error(error));
    });
  }

  getMyPolls(): Observable<any[]> {
    const userEmail = localStorage.getItem('user');
    return this.firestore.collection('polls', ref =>
      ref.where('createdBy', '==', userEmail)
    ).snapshotChanges().pipe(
      map(snaps => snaps.map(snap => {
        const data: any = snap.payload.doc.data();
        const firstQuestion = data.questions && data.questions.length > 0 ? data.questions[0] : {};
        return {
          id: snap.payload.doc.id,
          title: firstQuestion?.question || 'Anket',
          description: `${data.questions?.length || 0} sorudan oluşuyor.`,
          endDate: '2025-07-01',
          options: Array.isArray(firstQuestion?.options) ? firstQuestion.options : []
        };
      }))
    );
  }

  getMyVotedPolls(): Observable<any[]> {
    const userEmail = localStorage.getItem('user');
    return this.firestore.collection('polls', ref =>
      ref.where('votedBy', 'array-contains', userEmail)
    ).snapshotChanges().pipe(
      map(snaps => snaps.map(snap => {
        const data: any = snap.payload.doc.data();
        return {
          id: snap.payload.doc.id,
          title: data.questions[0]?.question || 'Anket',
          description: `${data.questions.length} sorudan oluşuyor.`,
          options: data.questions[0].options || []
        };
      }))
    );
  }

}
