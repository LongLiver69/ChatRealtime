import { Component, OnInit } from '@angular/core';
import { SignalrService } from '../signalr.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  listOnUser: any = [];

  listMsg: any = [];

  msg: string;

  constructor(
    public signalrService: SignalrService,
  ) {

  }


  ngOnInit(): void {
    this.logOutListener();
    this.userOnListener();
    this.userOffListener();
    this.getOnlineUsersListener();
    this.getMsgListener();

    const hubConnection: any = this.signalrService.hubConnection;

    if (hubConnection?.connection.connectionState == 1) {
      this.getOnlineUsers();
    }
    else {
      this.signalrService.ssObs().subscribe((obj: any) => {
        if (obj.type == "HubConnStarted") {
          this.getOnlineUsers();
        }
      });
    }
  }

  logOut(): void {
    const personId = localStorage.getItem("personId");
    this.signalrService.hubConnection.invoke("logOut", +personId)
      .catch(err => console.error(err));
  }

  logOutListener(): void {
    this.signalrService.hubConnection.on("logoutResponse", () => {
      localStorage.removeItem("personId");
      location.reload();
      // this.signalrService.hubConnection.stop();
    });
  }

  userOnListener(): void {
    this.signalrService.hubConnection.on("userOn", (newUser: any) => {
      this.listOnUser.push(newUser);
    });
  }

  userOffListener(): void {
    this.signalrService.hubConnection.on("userOff", (personId: any) => {
      this.listOnUser = this.listOnUser.filter(u => u.userId != personId);
    });
  }

  getOnlineUsers(): void {
    this.signalrService.hubConnection.invoke("GetOnlineUsers")
      .catch(err => console.error(err));
  }

  getOnlineUsersListener(): void {
    this.signalrService.hubConnection.on("getOnlineUsersResponse", (onlineUsers: Array<any>) => {
      this.listOnUser = [...onlineUsers];
    });
  }

  sendMsg(): void {
    const msgInfo: any = {
      fromUserId: this.signalrService.meId,
      toUserId: this.listOnUser[0].userId,
      fromConnectionId: this.signalrService.meConnection,
      toConnectionId: this.listOnUser[0].signalrId,
      msg: this.msg
    }
    this.signalrService.hubConnection.invoke("SendMsg", msgInfo)
      .then(() => {
        this.listMsg.push(msgInfo);
        this.msg = "";
      })
      .catch(err => console.error(err));
  }

  getMsgListener(): void {
    this.signalrService.hubConnection.on("sendMsgResponse", (msgInfo: any) => {
      this.listMsg.push(msgInfo);
    });
  }

}
