import { Injectable } from '@angular/core';
import { UserAuth } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class Storage {
  private readonly USER_KEY = 'currentUser';

  saveUser(user: UserAuth): void {
    sessionStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  getUser(): UserAuth | null {
    const userStr = sessionStorage.getItem(this.USER_KEY);
    if(userStr){
      return JSON.parse(userStr);
    }
    return null;
  }

  isLoggedIn(): boolean {
    return this.getUser() !== null;
  }

  clearUser(): void {
    sessionStorage.removeItem(this.USER_KEY);
  }
}
