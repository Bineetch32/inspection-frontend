import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface LoginResponse {
  username: string;
  role: string;
  active: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly apiUrl =
    window.location.hostname === 'localhost'
      ? 'http://localhost:8080/api/auth'
      : 'https://inspection-backend-live-production.up.railway.app/api/auth';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, {
        username,
        password
      })
      .pipe(
        tap(response => {
          sessionStorage.setItem('loggedInUser', JSON.stringify(response));
        })
      );
  }

  getLoggedInUser(): LoginResponse | null {
    const data = sessionStorage.getItem('loggedInUser');
    return data ? JSON.parse(data) : null;
  }

  logout(): void {
    sessionStorage.removeItem('loggedInUser');
  }

  isLoggedIn(): boolean {
    return !!this.getLoggedInUser();
  }
}
