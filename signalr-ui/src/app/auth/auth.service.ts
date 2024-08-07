import { SignalrService } from 'src/app/signalr.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {

  public isAuthenticated: boolean = false;

  constructor(
    public signalrService: SignalrService,
    public router: Router
  ) {
    const tempPersonId = localStorage.getItem("personId");

    if (tempPersonId) {
      const hubConnection: any = this.signalrService.hubConnection;

      if (hubConnection?.connection.connectionState == 1) {
        this.reauthMeListener();
        this.reauthMe(tempPersonId);
      }
      else {
        this.signalrService.ssObs().subscribe((obj: any) => {
          if (obj.type == "HubConnStarted") {
            this.reauthMeListener();
            this.reauthMe(tempPersonId);
          }
        });
      }
    }
  }


  async authMe(username: any, password: any) {
    let account = { userName: username, password: password };

    await this.signalrService.hubConnection.invoke("authMe", account)
      .then(() => this.signalrService.toastr.info("Loging in attempt..."))
      .catch(err => console.error(err));
  }


  authMeListenerSuccess() {
    this.signalrService.hubConnection.on("authMeResponseSuccess", (person: any,) => {
      localStorage.setItem("personId", person.userId);
      this.signalrService.meId = person.userId;
      this.signalrService.personName = person.fullName;
      this.signalrService.meConnection = person.signalrId;

      this.isAuthenticated = true;
      this.signalrService.toastr.success("Login successful!");
      this.signalrService.router.navigateByUrl("/chat");
    });
  }


  authMeListenerFail() {
    this.signalrService.hubConnection.on("authMeResponseFail", () => {
      this.signalrService.toastr.error("Wrong credentials!");
    });
  }


  async reauthMe(personId: any) {
    await this.signalrService.hubConnection.invoke("reauthMe", +personId)
      .then(() => this.signalrService.toastr.info("Loging in attempt..."))
      .catch(err => console.error(err));
  }


  reauthMeListener() {
    this.signalrService.hubConnection.on("reauthMeResponse", (person: any) => {
      this.signalrService.meId = person.userId;
      this.signalrService.personName = person.fullName;
      this.signalrService.meConnection = person.signalrId;

      this.isAuthenticated = true;
      this.signalrService.toastr.success("Re-authenticated!");
      if (this.signalrService.router.url == "/auth") this.signalrService.router.navigateByUrl("/chat");
    });
  }

}