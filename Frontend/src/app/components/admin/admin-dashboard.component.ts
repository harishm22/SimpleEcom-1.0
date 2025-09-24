import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule
  ],
  template: `
    <div class="dashboard-container">
      <div class="sidebar">
        <div class="brand">
          <div class="brand-icon">🛒</div>
          <h2>SimpleEcom</h2>
        </div>
        
        <div class="user-info">
          <div class="user-avatar">{{username.charAt(0).toUpperCase()}}</div>
          <div class="user-details">
            <h4>{{username}}</h4>
            <span class="role-badge" [class.super-admin]="isSuperAdmin">
              {{isSuperAdmin ? 'Super Admin' : 'Admin'}}
            </span>
          </div>
        </div>
        
        <nav class="nav-menu">
          <div class="nav-item" (click)="manageProducts()">
            <span class="nav-icon">🏢</span>
            <span>Products</span>
          </div>
          <div class="nav-item" (click)="manageOrders()">
            <span class="nav-icon">📝</span>
            <span>Orders</span>
          </div>
          <div class="nav-item" *ngIf="isSuperAdmin" (click)="manageUsers()">
            <span class="nav-icon">👨‍💼</span>
            <span>Users</span>
          </div>
          <div class="nav-item" (click)="viewAnalytics()">
            <span class="nav-icon">📈</span>
            <span>Analytics</span>
          </div>
          <div class="nav-item" (click)="viewProfile()">
            <span class="nav-icon">⚙️</span>
            <span>Profile</span>
          </div>
        </nav>
        
        <div class="sidebar-footer">
          <button class="logout-btn" (click)="logout()">
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </div>
      
      <div class="main-content">
        <div class="header">
          <h1>Dashboard Overview</h1>
          <div class="header-actions">
            <div class="quick-stats">
              <div class="stat-item">
                <span class="stat-value">{{totalProducts}}</span>
                <span class="stat-label">Products</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">{{totalOrders}}</span>
                <span class="stat-label">Orders</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="content-grid">
          <div class="feature-card" (click)="manageProducts()">
            <div class="card-header">
              <div class="card-icon products">📦</div>
              <h3>Product Management</h3>
            </div>
            <p>Manage your product catalog, inventory, and pricing</p>
            <div class="card-action">
              <span>Manage Products →</span>
            </div>
          </div>
          
          <div class="feature-card" (click)="manageOrders()">
            <div class="card-header">
              <div class="card-icon orders">📋</div>
              <h3>Order Management</h3>
            </div>
            <p>Track and manage customer orders and deliveries</p>
            <div class="card-action">
              <span>View Orders →</span>
            </div>
          </div>
          
          <div class="feature-card" *ngIf="isSuperAdmin" (click)="manageUsers()">
            <div class="card-header">
              <div class="card-icon users">👥</div>
              <h3>User Management</h3>
            </div>
            <p>Manage user accounts and administrator permissions</p>
            <div class="card-action">
              <span>Manage Users →</span>
            </div>
          </div>
          
          <div class="feature-card" (click)="viewAnalytics()">
            <div class="card-header">
              <div class="card-icon analytics">📊</div>
              <h3>Analytics & Reports</h3>
            </div>
            <p>View sales analytics and business performance metrics</p>
            <div class="card-action">
              <span>View Analytics →</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      display: flex;
      min-height: 100vh;
      font-family: 'Inter', 'Segoe UI', sans-serif;
    }
    
    .sidebar {
      width: 280px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      display: flex;
      flex-direction: column;
      padding: 0;
    }
    
    .brand {
      padding: 30px 20px;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .brand-icon {
      font-size: 28px;
    }
    
    .brand h2 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
    }
    
    .user-info {
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 15px;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    
    .user-avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: rgba(255,255,255,0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 18px;
    }
    
    .user-details h4 {
      margin: 0 0 4px 0;
      font-size: 16px;
      font-weight: 600;
    }
    
    .role-badge {
      background: rgba(255,255,255,0.2);
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 500;
    }
    
    .role-badge.super-admin {
      background: rgba(231, 76, 60, 0.3);
    }
    
    .nav-menu {
      flex: 1;
      padding: 20px 0;
    }
    
    .nav-item {
      display: flex;
      align-items: center;
      gap: 15px;
      padding: 15px 20px;
      cursor: pointer;
      transition: all 0.2s;
      border-left: 3px solid transparent;
    }
    
    .nav-item:hover {
      background: rgba(255,255,255,0.1);
      border-left-color: rgba(255,255,255,0.5);
    }
    
    .nav-icon {
      font-size: 20px;
      width: 24px;
    }
    
    .sidebar-footer {
      padding: 20px;
      border-top: 1px solid rgba(255,255,255,0.1);
    }
    
    .logout-btn {
      width: 100%;
      background: rgba(255,255,255,0.1);
      border: 1px solid rgba(255,255,255,0.2);
      color: white;
      padding: 12px;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 0.2s;
    }
    
    .logout-btn:hover {
      background: rgba(255,255,255,0.2);
    }
    
    .main-content {
      flex: 1;
      background: #f8fafc;
      overflow-y: auto;
    }
    
    .header {
      background: white;
      padding: 30px 40px;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 600;
      color: #1a202c;
    }
    
    .quick-stats {
      display: flex;
      gap: 30px;
    }
    
    .stat-item {
      text-align: center;
    }
    
    .stat-value {
      display: block;
      font-size: 24px;
      font-weight: 700;
      color: #667eea;
    }
    
    .stat-label {
      font-size: 12px;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .content-grid {
      padding: 40px;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
      max-width: 1200px;
    }
    
    .feature-card {
      background: white;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      border: 1px solid #e2e8f0;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }
    
    .feature-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    }
    
    .card-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 12px;
    }
    
    .card-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
    }
    
    .card-icon.products {
      background: linear-gradient(135deg, #667eea, #764ba2);
    }
    
    .card-icon.orders {
      background: linear-gradient(135deg, #f093fb, #f5576c);
    }
    
    .card-icon.users {
      background: linear-gradient(135deg, #4facfe, #00f2fe);
    }
    
    .card-icon.analytics {
      background: linear-gradient(135deg, #43e97b, #38f9d7);
    }
    
    .feature-card h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #1a202c;
    }
    
    .feature-card p {
      color: #64748b;
      font-size: 14px;
      line-height: 1.5;
      margin: 0 0 20px 0;
    }
    
    .card-action {
      color: #667eea;
      font-weight: 500;
      font-size: 14px;
    }
    
    @media (max-width: 768px) {
      .sidebar {
        width: 240px;
      }
      
      .header {
        padding: 20px;
        flex-direction: column;
        gap: 20px;
        align-items: flex-start;
      }
      
      .content-grid {
        padding: 20px;
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  username: string = '';
  isSuperAdmin: boolean = false;
  totalProducts: number = 0;
  totalOrders: number = 0;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.username = user?.username || localStorage.getItem('username') || 'Admin';
    this.isSuperAdmin = this.authService.isSuperAdmin();
    this.loadStats();
  }

  loadStats(): void {
    // Get actual product count from localStorage
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    this.totalProducts = products.length;
    
    // Get actual order count from localStorage
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    this.totalOrders = orders.length;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  manageProducts(): void {
    this.router.navigate(['/product-management']);
  }

  manageUsers(): void {
    this.router.navigate(['/user-management']);
  }



  viewAnalytics(): void {
    this.router.navigate(['/analytics']);
  }

  manageOrders(): void {
    this.router.navigate(['/order-management']);
  }

  viewProfile(): void {
    this.router.navigate(['/admin-profile']);
  }
}