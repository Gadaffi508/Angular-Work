import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreatePollComponent } from './pages/create-poll/create-poll.component';
import { PollListComponent } from './pages/poll-list/poll-list.component';
import { PollResultComponent } from './pages/poll-result/poll-result.component';
import { AboutComponent } from './pages/about/about.component';
import { HomeComponent } from './pages/home/home.component';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HttpClientModule } from '@angular/common/http';

import { PollVoteComponent } from './poll-vote/poll-vote.component';

@NgModule({
  declarations: [
    AppComponent,
    CreatePollComponent,
    PollListComponent,
    PollResultComponent,
    AboutComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    PollVoteComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
