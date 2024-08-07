import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from './auth.service';

//3Tutorial
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(public authService: AuthService) { }

  canActivate(): boolean {
    const tempPersonId = localStorage.getItem("personId");
    if (!tempPersonId) {
      this.authService.router.navigateByUrl("auth");
      return false;
    }
    return true;
  }
}