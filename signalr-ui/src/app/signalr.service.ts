import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as signalR from '@aspnet/signalr';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SignalrService {
  constructor(
    public toastr: ToastrService,
    public router: Router
  ) { }

  hubConnection: signalR.HubConnection;

  meId: number;
  personName: string;
  meConnection: string;

  ssSubj = new Subject<any>();

  ssObs(): Observable<any> {
    return this.ssSubj.asObservable();
  }

  startConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5294/toastr', {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .build();

    this.hubConnection
      .start()
      .then(() => {
        this.ssSubj.next({ type: "HubConnStarted" });
      })
      .catch(err => console.log('Error while starting connection: ' + err))
  }

}