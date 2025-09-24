import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="header">
      <h1>Admin Profile</h1>
      <button class="back-btn" (click)="goBack()">← Back to Admin</button>
    </div>

    <div class="container">
      <div class="profile-section">
        <div class="profile-card">
          <div class="profile-header">
            <div class="avatar">{{username.charAt(0).toUpperCase()}}</div>
            <div class="profile-info">
              <h2>{{username}}</h2>
              <span class="role-badge" [class.super-admin]="isSuperAdmin">
                {{isSuperAdmin ? 'Super Administrator' : 'Administrator'}}
              </span>
            </div>
          </div>

          <form [formGroup]="profileForm" (ngSubmit)="updateProfile()" class="profile-form">
            <div class="form-section">
              <h3>Personal Information</h3>
              
              <div class="form-field">
                <label>Username</label>
                <input type="text" formControlName="username" readonly>
              </div>
              
              <div class="form-field">
                <label>Email Address</label>
                <input type="email" formControlName="email" placeholder="Enter your email">
              </div>
              
              <div class="form-field">
                <label>Full Name</label>
                <input type="text" formControlName="fullName" placeholder="Enter your full name">
              </div>
              
              <div class="form-field">
                <label>Phone Number</label>
                <input type="tel" formControlName="phone" placeholder="Enter your phone number">
              </div>
              
              <div class="form-field">
                <label>Product Specializations</label>
                <div class="checkbox-group">
                  <label class="checkbox-item" *ngFor="let category of categories">
                    <input type="checkbox" 
                           [checked]="selectedCategories.includes(category)"
                           (change)="toggleCategory(category)">
                    <span>{{category}}</span>
                  </label>
                </div>
                <div class="selected-categories" *ngIf="selectedCategories.length > 0">
                  <span class="category-tag" *ngFor="let category of selectedCategories">
                    {{category}}
                    <button type="button" class="remove-tag" (click)="removeCategory(category)">×</button>
                  </span>
                </div>
              </div>
            </div>

            <div class="form-section">
              <h3>Security Settings</h3>
              
              <div class="form-field">
                <label>Current Password</label>
                <input type="password" formControlName="currentPassword" placeholder="Enter current password">
              </div>
              
              <div class="form-field">
                <label>New Password</label>
                <input type="password" formControlName="newPassword" placeholder="Enter new password">
              </div>
              
              <div class="form-field">
                <label>Confirm New Password</label>
                <input type="password" formControlName="confirmPassword" placeholder="Confirm new password">
              </div>
            </div>

            <div class="form-actions">
              <button type="button" class="cancel-btn" (click)="resetForm()">Reset</button>
              <button type="submit" class="save-btn" [disabled]="profileForm.invalid">Save Changes</button>
            </div>
          </form>
        </div>

        <div class="settings-card">
          <h3>System Preferences</h3>
          
          <div class="setting-item">
            <label class="setting-label">
              <input type="checkbox" [checked]="settings.emailNotifications" (change)="toggleSetting('emailNotifications')">
              <span>Email Notifications</span>
            </label>
            <p>Receive email notifications for important system events</p>
          </div>
          
          <div class="setting-item">
            <label class="setting-label">
              <input type="checkbox" [checked]="settings.orderAlerts" (change)="toggleSetting('orderAlerts')">
              <span>Order Alerts</span>
            </label>
            <p>Get notified when new orders are placed</p>
          </div>
          
          <div class="setting-item">
            <label class="setting-label">
              <input type="checkbox" [checked]="settings.lowStockAlerts" (change)="toggleSetting('lowStockAlerts')">
              <span>Low Stock Alerts</span>
            </label>
            <p>Receive alerts when product inventory is low</p>
          </div>
          
          <div class="setting-item">
            <label class="setting-label">
              <input type="checkbox" [checked]="settings.darkMode" (change)="toggleSetting('darkMode')">
              <span>Dark Mode</span>
            </label>
            <p>Use dark theme for the admin interface</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    
    .back-btn {
      background: rgba(255,255,255,0.2);
      border: 1px solid rgba(255,255,255,0.3);
      color: white;
      padding: 10px 20px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
    }
    
    .container {
      padding: 40px;
      background: #f8f9fa;
      min-height: calc(100vh - 84px);
    }
    
    .profile-section {
      max-width: 1000px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 30px;
    }
    
    .profile-card, .settings-card {
      background: white;
      border-radius: 12px;
      padding: 30px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.08);
    }
    
    .profile-header {
      display: flex;
      align-items: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 1px solid #e9ecef;
    }
    
    .avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 32px;
      font-weight: 600;
      margin-right: 20px;
    }
    
    .profile-info h2 {
      margin: 0 0 8px 0;
      color: #2c3e50;
      font-size: 24px;
    }
    
    .role-badge {
      background: #3498db;
      color: white;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
    }
    
    .role-badge.super-admin {
      background: #e74c3c;
    }
    
    .form-section {
      margin-bottom: 30px;
    }
    
    .form-section h3 {
      color: #2c3e50;
      margin-bottom: 20px;
      font-size: 18px;
      border-bottom: 2px solid #3498db;
      padding-bottom: 8px;
    }
    
    .form-field {
      margin-bottom: 20px;
    }
    
    .form-field label {
      display: block;
      color: #2c3e50;
      font-weight: 600;
      margin-bottom: 8px;
      font-size: 14px;
    }
    
    .form-field input {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid #e1e8ed;
      border-radius: 8px;
      font-size: 16px;
      transition: border-color 0.3s;
      box-sizing: border-box;
    }
    
    .form-field input:focus {
      outline: none;
      border-color: #3498db;
    }
    
    .form-field input:read-only {
      background: #f8f9fa;
      color: #6c757d;
    }
    
    .specialization-select {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid #e1e8ed;
      border-radius: 8px;
      font-size: 16px;
      transition: border-color 0.3s;
      box-sizing: border-box;
      background: white;
    }
    
    .checkbox-group {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 12px;
      margin-bottom: 15px;
    }
    
    .checkbox-item {
      display: flex;
      align-items: center;
      cursor: pointer;
      padding: 8px;
      border-radius: 6px;
      transition: background 0.2s;
    }
    
    .checkbox-item:hover {
      background: #f8f9fa;
    }
    
    .checkbox-item input {
      margin-right: 8px;
      transform: scale(1.1);
    }
    
    .selected-categories {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 10px;
    }
    
    .category-tag {
      background: #3498db;
      color: white;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    
    .remove-tag {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      font-size: 16px;
      padding: 0;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .remove-tag:hover {
      background: rgba(255,255,255,0.2);
    }
    
    .form-actions {
      display: flex;
      gap: 15px;
      justify-content: flex-end;
      margin-top: 30px;
    }
    
    .cancel-btn, .save-btn {
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .cancel-btn {
      background: #6c757d;
      color: white;
      border: none;
    }
    
    .save-btn {
      background: #27ae60;
      color: white;
      border: none;
    }
    
    .save-btn:disabled {
      background: #bdc3c7;
      cursor: not-allowed;
    }
    
    .settings-card h3 {
      color: #2c3e50;
      margin-bottom: 25px;
      font-size: 18px;
    }
    
    .setting-item {
      margin-bottom: 25px;
      padding-bottom: 20px;
      border-bottom: 1px solid #f1f3f4;
    }
    
    .setting-label {
      display: flex;
      align-items: center;
      cursor: pointer;
      font-weight: 600;
      color: #2c3e50;
      margin-bottom: 5px;
    }
    
    .setting-label input {
      margin-right: 10px;
      transform: scale(1.2);
    }
    
    .setting-item p {
      color: #6c757d;
      font-size: 14px;
      margin: 0;
      margin-left: 30px;
    }
  `]
})
export class AdminProfileComponent implements OnInit {
  profileForm: FormGroup;
  username: string = '';
  isSuperAdmin: boolean = false;
  selectedCategories: string[] = [];
  categories = [
    'Electronics',
    'Clothing & Fashion', 
    'Food & Beverages',
    'Books & Education',
    'Home & Garden',
    'Sports & Fitness',
    'Beauty & Personal Care',
    'Automotive',
    'General Merchandise'
  ];
  settings = {
    emailNotifications: true,
    orderAlerts: true,
    lowStockAlerts: false,
    darkMode: false
  };

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      fullName: [''],
      phone: [''],
      specialization: [''],
      currentPassword: [''],
      newPassword: [''],
      confirmPassword: ['']
    });
  }

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.username = user?.username || localStorage.getItem('username') || 'Admin';
    this.isSuperAdmin = this.authService.isSuperAdmin();
    
    this.loadProfileData();
  }

  updateProfile(): void {
    if (this.profileForm.valid) {
      const formData = this.profileForm.value;
      const userKey = `user_${this.username}`;
      
      // Update local storage with user-specific keys
      if (formData.email) {
        localStorage.setItem(`${userKey}_email`, formData.email);
      }
      if (formData.fullName) {
        localStorage.setItem(`${userKey}_fullName`, formData.fullName);
      }
      if (formData.phone) {
        localStorage.setItem(`${userKey}_phone`, formData.phone);
      }
      // Save selected categories
      localStorage.setItem(`${userKey}_specializations`, JSON.stringify(this.selectedCategories));
      
      alert('Profile updated successfully!');
      this.loadProfileData();
    }
  }
  
  loadProfileData(): void {
    const userKey = `user_${this.username}`;
    const email = localStorage.getItem(`${userKey}_email`) || '';
    const fullName = localStorage.getItem(`${userKey}_fullName`) || '';
    const phone = localStorage.getItem(`${userKey}_phone`) || '';
    const specializations = localStorage.getItem(`${userKey}_specializations`);
    this.selectedCategories = specializations ? JSON.parse(specializations) : [];
    
    this.profileForm.patchValue({
      username: this.username,
      email: email,
      fullName: fullName,
      phone: phone
    });
  }

  resetForm(): void {
    this.profileForm.reset();
    this.ngOnInit();
  }

  toggleCategory(category: string): void {
    const index = this.selectedCategories.indexOf(category);
    if (index > -1) {
      this.selectedCategories.splice(index, 1);
    } else {
      this.selectedCategories.push(category);
    }
  }

  removeCategory(category: string): void {
    const index = this.selectedCategories.indexOf(category);
    if (index > -1) {
      this.selectedCategories.splice(index, 1);
    }
  }

  toggleSetting(setting: keyof typeof this.settings): void {
    this.settings[setting] = !this.settings[setting];
  }

  goBack(): void {
    this.router.navigate(['/admin']);
  }
}