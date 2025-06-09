import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { from, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PollService {

  constructor(private firestore: AngularFirestore) { }

  createPoll(questions: any[]): Observable<any> {
    const poll = {
      questions,
      createdAt: new Date(),
      createdBy: localStorage.getItem('user')
    };
    return from(this.firestore.collection('polls').add(poll));
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
        return {
          id: snap.payload.doc.id,
          title: data.questions[0]?.question || 'Anket',
          description: `${data.questions.length} sorudan oluşuyor.`,
          endDate: '2025-07-01',
          options: data.questions[0].options || []
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

    return pollRef.get().pipe(
      map(snapshot => {
        const pollData: any = snapshot.data();
        const updatedQuestions = [...pollData.questions];
        const votedBy = pollData.votedBy || [];

        if (updatedQuestions[questionIndex].type === 'text') {
          updatedQuestions[questionIndex].answers = [
            ...(updatedQuestions[questionIndex].answers || []),
            selectedIndexOrText
          ];
        } else {
          updatedQuestions[questionIndex].options[selectedIndexOrText].votes++;
        }

        if (!votedBy.includes(userEmail)) {
          votedBy.push(userEmail);
        }

        pollRef.update({
          questions: updatedQuestions,
          votedBy
        });
      })
    );
  }

  getMyPolls(): Observable<any[]> {
    const userEmail = localStorage.getItem('user');
    return this.firestore.collection('polls', ref =>
      ref.where('createdBy', '==', userEmail)
    ).snapshotChanges().pipe(
      map(snaps => snaps.map(snap => {
        const data: any = snap.payload.doc.data();
        return {
          id: snap.payload.doc.id,
          title: data.questions[0]?.question || 'Anket',
          description: `${data.questions.length} sorudan oluşuyor.`,
          endDate: '2025-07-01',
          options: data.questions[0].options || []
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
