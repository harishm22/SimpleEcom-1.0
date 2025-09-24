import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSnackBarModule
  ],
  template: `
    <div class="login-container">
      <div class="login-left">
        <div class="brand-section">
          <div class="brand-logo">
            <div class="logo-circle">
              <span>🛒</span>
            </div>
            <h1>SimpleEcom</h1>
          </div>
          <p class="brand-tagline">Your one-stop shopping destination</p>
          
          <div class="features-list">
            <div class="feature-item">
              <span class="icon">✨</span>
              <span>Premium Quality Products</span>
            </div>
            <div class="feature-item">
              <span class="icon">🚚</span>
              <span>Fast & Free Delivery</span>
            </div>
            <div class="feature-item">
              <span class="icon">🔒</span>
              <span>Secure Payment Gateway</span>
            </div>
            <div class="feature-item">
              <span class="icon">💯</span>
              <span>100% Satisfaction Guarantee</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="login-right">
        <div class="login-form-container">
          <div class="form-header">
            <h2>Welcome Back</h2>
            <p>Sign in to your account</p>
          </div>
          
          <form [formGroup]="loginForm" (ngSubmit)="onLogin()" class="login-form">
            <div class="input-group">
              <label>Username</label>
              <input type="text" formControlName="username" placeholder="Enter username">
            </div>
            
            <div class="input-group">
              <label>Password</label>
              <input type="password" formControlName="password" placeholder="Enter password">
            </div>
            
            <button type="submit" class="signin-btn" [disabled]="loginForm.invalid">
              <span *ngIf="!isLoading">Sign In</span>
              <div class="spinner" *ngIf="isLoading"></div>
            </button>
          </form>
          
          <div class="signup-link">
            <p>Don't have an account? <a (click)="goToRegister()">Sign up</a></p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      min-height: 100vh;
      font-family: 'Inter', 'Segoe UI', sans-serif;
    }
    
    .login-left {
      flex: 1;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px;
      color: white;
    }
    
    .login-right {
      flex: 1;
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px;
    }
    
    .brand-section {
      text-align: center;
      max-width: 400px;
    }
    
    .brand-logo {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 15px;
      margin-bottom: 20px;
    }
    
    .logo-circle {
      width: 60px;
      height: 60px;
      background: rgba(255,255,255,0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
    }
    
    .brand-logo h1 {
      font-size: 32px;
      font-weight: 700;
      margin: 0;
    }
    
    .brand-tagline {
      font-size: 18px;
      opacity: 0.9;
      margin-bottom: 40px;
    }
    
    .features-list {
      text-align: left;
    }
    
    .feature-item {
      display: flex;
      align-items: center;
      gap: 15px;
      margin-bottom: 20px;
      font-size: 16px;
    }
    
    .feature-item .icon {
      font-size: 20px;
    }
    
    .login-form-container {
      width: 100%;
      max-width: 400px;
    }
    
    .form-header {
      text-align: center;
      margin-bottom: 30px;
    }
    
    .form-header h2 {
      font-size: 28px;
      font-weight: 600;
      color: #2c3e50;
      margin: 0 0 8px 0;
    }
    
    .form-header p {
      color: #7f8c8d;
      font-size: 16px;
      margin: 0;
    }
    
    .login-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    
    .input-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .input-group label {
      font-weight: 500;
      color: #374151;
      font-size: 14px;
    }
    
    .input-group input {
      padding: 12px 16px;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      font-size: 16px;
      transition: border-color 0.2s;
    }
    
    .input-group input:focus {
      outline: none;
      border-color: #667eea;
    }
    
    .signin-btn {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      border: none;
      padding: 14px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    
    .signin-btn:hover:not(:disabled) {
      transform: translateY(-1px);
    }
    
    .signin-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top: 2px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .signup-link {
      text-align: center;
      margin-top: 30px;
    }
    
    .signup-link p {
      color: #6b7280;
      font-size: 14px;
      margin: 0;
    }
    
    .signup-link a {
      color: #667eea;
      text-decoration: none;
      font-weight: 600;
      cursor: pointer;
    }
    
    .signup-link a:hover {
      text-decoration: underline;
    }
    
    @media (max-width: 768px) {
      .login-container {
        flex-direction: column;
      }
      
      .login-left {
        padding: 20px;
      }
      
      .login-right {
        padding: 20px;
      }
    }

    

  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (this.authService.isAdmin()) {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/dashboard']);
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Login error:', error);
          const errorMessage = error.error?.message || error.message || 'Invalid credentials';
          this.snackBar.open(errorMessage, 'Close', { duration: 3000 });
        }
      });
    }
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }


}