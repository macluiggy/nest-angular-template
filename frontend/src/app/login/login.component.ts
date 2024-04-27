import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { StorageService } from '../services/storage/storage.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  form = {
    email: '',
    password: '',
  };
  user: any;

  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];

  constructor(
    private authService: AuthService,
    private storageService: StorageService,
  ) {}
  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
    }
    this.user = this.storageService.getUser();
  }

  login() {
    const { email, password } = this.form;

    this.authService.signIn({ email, password }).subscribe({
      next: (response: any) => {
        // TODO: change backend to return user object apart from token
        this.storageService.saveUser(response.user);
        this.user = response.user;

        AuthService.setToken(response.access_token);

        this.authService.setIsLoggedIn(true);

        this.isLoggedIn = true;
        this.isLoginFailed = false;
      },
      error: (error) => {
        this.errorMessage = error.error.message;
        this.isLoginFailed = true;
      },
    });
  }
}
