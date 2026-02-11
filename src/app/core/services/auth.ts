import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable} from 'rxjs';
import { UserAuth, User } from '../models/user';
import { Storage } from './storage';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient, private storageService: Storage){}

  register(user: User): Observable<UserAuth> {
    return this.http.post<User>(this.apiUrl, user).pipe(
      map(createdUser => {
        const { password, ...userWithoutPassword } = createdUser;
        return userWithoutPassword as UserAuth;
      })
    );
  }

  login(email: string, password: string): Observable<UserAuth> {
    return this.http.get<User[]>(`${this.apiUrl}?email=${email}&password=${password}`).pipe(
      map(users => {
        if(users.length === 0) {
          throw new Error('email ou mots de passe incorrect');
        }

        const user = users[0];

        const { password, ...userWithoutPassword } = user;
        const userAuth = userWithoutPassword as UserAuth;

        this.storageService.saveUser(userAuth);

        return userAuth;
      })
    );
  }

  logout(): void {
    this.storageService.clearUser();
  }

  isAuthenticated(): boolean {
    return this.storageService.isLoggedIn();
  }

  getCurrentUser(): UserAuth | null {
    return this.storageService.getUser();
  }

  updateUser(userId: number, userData: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${userId}`, userData);
  }

  deleteUser(UserId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${UserId}`);
  }

  checkEmailExists(email: string): Observable<boolean> {
    return this.http.get<User[]>(`${this.apiUrl}?email=${email}`).pipe(
      map(users => users.length > 0)
    );
  }
}
