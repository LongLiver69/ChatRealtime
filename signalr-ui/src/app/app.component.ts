import { Component, OnDestroy, OnInit } from '@angular/core';
import { SignalrService } from './signalr.service';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  constructor(
    public signalrService: SignalrService,
  ) { }

  ngOnInit() {
    this.signalrService.startConnection();
  }

  ngOnDestroy() {
    this.signalrService.hubConnection.off("askServerResponse");
  }

}
