import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatSnackBarModule
  ],
  template: `
    <div class="register-container">
      <div class="register-left">
        <div class="brand-section">
          <div class="brand-logo">
            <div class="logo-circle">
              <span>🛒</span>
            </div>
            <h1>SimpleEcom</h1>
          </div>
          <p class="brand-tagline">Join thousands of happy customers</p>
          
          <div class="benefits-list">
            <div class="benefit-item">
              <span class="icon">🎉</span>
              <span>Exclusive member discounts</span>
            </div>
            <div class="benefit-item">
              <span class="icon">🚚</span>
              <span>Free shipping on all orders</span>
            </div>
            <div class="benefit-item">
              <span class="icon">🔔</span>
              <span>Early access to new products</span>
            </div>
            <div class="benefit-item">
              <span class="icon">💳</span>
              <span>Secure payment processing</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="register-right">
        <div class="register-form-container">
          <div class="form-header">
            <h2>Create Account</h2>
            <p>Start your shopping journey today</p>
          </div>
          
          <form [formGroup]="registerForm" (ngSubmit)="onRegister()" class="register-form">
            <div class="input-group">
              <label>Username</label>
              <input type="text" formControlName="username" placeholder="Choose username">
            </div>
            
            <div class="input-group">
              <label>Email Address</label>
              <input type="email" formControlName="email" placeholder="Enter email">
            </div>
            
            <div class="input-group">
              <label>Password</label>
              <input type="password" formControlName="password" placeholder="Create password">
            </div>
            
            <div class="input-group">
              <label>Account Type</label>
              <select formControlName="role">
                <option value="USER">Regular User</option>
                <option value="ADMIN">Administrator (Requires Approval)</option>
              </select>
            </div>
            
            <button type="submit" class="signup-btn" [disabled]="registerForm.invalid">
              <span *ngIf="!isLoading">Create Account</span>
              <div class="spinner" *ngIf="isLoading"></div>
            </button>
          </form>
          
          <div class="login-link">
            <p>Already have an account? <a (click)="goToLogin()">Sign in</a></p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      display: flex;
      min-height: 100vh;
      font-family: 'Inter', 'Segoe UI', sans-serif;
    }
    
    .register-left {
      flex: 1;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px;
      color: white;
    }
    
    .register-right {
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
    
    .benefits-list {
      text-align: left;
    }
    
    .benefit-item {
      display: flex;
      align-items: center;
      gap: 15px;
      margin-bottom: 20px;
      font-size: 16px;
    }
    
    .benefit-item .icon {
      font-size: 20px;
    }
    
    .register-form-container {
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
    
    .register-form {
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
    
    .input-group input, .input-group select {
      padding: 12px 16px;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      font-size: 16px;
      transition: border-color 0.2s;
    }
    
    .input-group input:focus, .input-group select:focus {
      outline: none;
      border-color: #667eea;
    }
    
    .signup-btn {
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
    
    .signup-btn:hover:not(:disabled) {
      transform: translateY(-1px);
    }
    
    .signup-btn:disabled {
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
    
    .login-link {
      text-align: center;
      margin-top: 30px;
    }
    
    .login-link p {
      color: #6b7280;
      font-size: 14px;
      margin: 0;
    }
    
    .login-link a {
      color: #667eea;
      text-decoration: none;
      font-weight: 600;
      cursor: pointer;
    }
    
    .login-link a:hover {
      text-decoration: underline;
    }
    
    @media (max-width: 768px) {
      .register-container {
        flex-direction: column;
      }
      
      .register-left {
        padding: 20px;
      }
      
      .register-right {
        padding: 20px;
      }
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['USER', Validators.required]
    });
  }

  onRegister(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      const formData = this.registerForm.value;
      const registerData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        roles: [formData.role]
      };

      this.authService.register(registerData).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (this.registerForm.value.role === 'ADMIN') {
            this.snackBar.open('Admin registration submitted! Awaiting SuperAdmin approval.', 'Close', { duration: 5000 });
          } else {
            this.snackBar.open('Registration successful! Please login.', 'Close', { duration: 3000 });
          }
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Registration error:', error);
          const errorMessage = error.error || 'Registration failed. Please try again.';
          this.snackBar.open(errorMessage, 'Close', { duration: 5000 });
        }
      });
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}