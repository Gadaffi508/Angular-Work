import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreatePollComponent } from './pages/create-poll/create-poll.component';
import { PollListComponent } from './pages/poll-list/poll-list.component';
import { PollResultComponent } from './pages/poll-result/poll-result.component';
import { AboutComponent } from './pages/about/about.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { PollVoteComponent } from './poll-vote/poll-vote.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'polls', component: PollListComponent },
  { path: 'create', component: CreatePollComponent },
  { path: 'results/:id', component: PollResultComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'vote/:id', component: PollVoteComponent },
  { path: 'about', component: AboutComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
