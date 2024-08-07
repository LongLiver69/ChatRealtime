import { Component, OnInit } from '@angular/core';
import { SignalrService } from '../signalr.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  formSearch: FormGroup;

  public isAuthenticated: boolean = false;

  constructor(
    public signalrService: SignalrService,
    public authService: AuthService,
    public formBuilder: FormBuilder
  ) {

  }

  ngOnInit(): void {
    this.formInit();

    this.authService.authMeListenerSuccess();
    this.authService.authMeListenerFail();
  }

  ngOnDestroy(): void {
    this.signalrService.hubConnection.off("authMeResponseSuccess");
    this.signalrService.hubConnection.off("authMeResponseFail");
  }

  formInit() {
    this.formSearch = this.formBuilder.group({
      username: [""],
      password: [""]
    });
  }

  onSubmit() {
    if (!this.formSearch.value.username && !this.formSearch.value.password) {
      return;
    }
    this.authService.authMe(this.formSearch.value.username, this.formSearch.value.password);
    this.formSearch.controls["username"].setValue("");
    this.formSearch.controls["password"].setValue("");
  }


}
