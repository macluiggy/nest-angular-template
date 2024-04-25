import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/v1'; // replace with your API URL

  constructor(private http: HttpClient) {}

  signIn(credentials: any) {
    return this.http.post(`${this.apiUrl}/auth/signin`, credentials);
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }
}
