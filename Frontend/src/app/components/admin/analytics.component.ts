import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { OrderService, Order } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="header">
      <h1>Analytics & Reports</h1>
      <button class="back-btn" (click)="goBack()">← Back to Admin</button>
    </div>

    <div class="container">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">📊</div>
          <div class="stat-info">
            <h3>Total Orders</h3>
            <p class="stat-value">{{totalOrders}}</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">💰</div>
          <div class="stat-info">
            <h3>Total Revenue</h3>
            <p class="stat-value">\${{totalRevenue.toFixed(2)}}</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">📈</div>
          <div class="stat-info">
            <h3>Average Order</h3>
            <p class="stat-value">\${{averageOrder.toFixed(2)}}</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">⏳</div>
          <div class="stat-info">
            <h3>Pending Orders</h3>
            <p class="stat-value">{{pendingOrders}}</p>
          </div>
        </div>
      </div>

      <div class="charts-section">
        <div class="chart-card">
          <h3>Orders by Status</h3>
          <div class="status-chart">
            <div class="status-item" *ngFor="let status of ordersByStatus">
              <div class="status-bar">
                <div class="bar-fill" [style.width.%]="status.percentage" [class]="status.name"></div>
              </div>
              <div class="status-info">
                <span class="status-name">{{status.name | titlecase}}</span>
                <span class="status-count">{{status.count}} ({{status.percentage}}%)</span>
              </div>
            </div>
          </div>
        </div>

        <div class="chart-card">
          <h3>Revenue by Category</h3>
          <div class="category-chart">
            <div class="category-item" *ngFor="let category of revenueByCategory">
              <div class="category-bar">
                <div class="bar-fill" [style.width.%]="category.percentage"></div>
              </div>
              <div class="category-info">
                <span class="category-name">{{category.name}}</span>
                <span class="category-revenue">\${{category.revenue.toFixed(2)}} ({{category.percentage}}%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="recent-orders">
        <h3>Recent Orders</h3>
        <div class="orders-table">
          <div class="table-header">
            <span>Order ID</span>
            <span>Customer</span>
            <span>Date</span>
            <span>Status</span>
            <span>Total</span>
          </div>
          <div class="table-row" *ngFor="let order of recentOrders">
            <span>#{{order.id}}</span>
            <span>{{order.customerName}}</span>
            <span>{{order.orderDate | date:'shortDate'}}</span>
            <span class="status" [class]="order.status">{{order.status}}</span>
            <span>\${{order.total.toFixed(2)}}</span>
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
    
    .back-btn {
      background: rgba(255,255,255,0.2);
      border: 1px solid rgba(255,255,255,0.3);
      color: white;
      padding: 10px 20px;
      border-radius: 6px;
      cursor: pointer;
    }
    
    .container {
      padding: 40px;
      background: #f8f9fa;
      min-height: calc(100vh - 84px);
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }
    
    .stat-card {
      background: white;
      padding: 25px;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.08);
      display: flex;
      align-items: center;
      gap: 20px;
    }
    
    .stat-icon {
      font-size: 40px;
    }
    
    .stat-info h3 {
      margin: 0 0 8px 0;
      color: #6c757d;
      font-size: 14px;
      font-weight: 500;
    }
    
    .stat-value {
      margin: 0;
      font-size: 28px;
      font-weight: 700;
      color: #2c3e50;
    }
    
    .charts-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      margin-bottom: 40px;
    }
    
    .chart-card {
      background: white;
      padding: 25px;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.08);
    }
    
    .chart-card h3 {
      margin: 0 0 20px 0;
      color: #2c3e50;
    }
    
    .status-item, .category-item {
      margin-bottom: 15px;
    }
    
    .status-bar, .category-bar {
      height: 8px;
      background: #e9ecef;
      border-radius: 4px;
      margin-bottom: 5px;
      overflow: hidden;
    }
    
    .bar-fill {
      height: 100%;
      transition: width 0.3s ease;
    }
    
    .bar-fill.pending { background: #f39c12; }
    .bar-fill.processing { background: #3498db; }
    .bar-fill.shipped { background: #27ae60; }
    .bar-fill.delivered { background: #2ecc71; }
    .bar-fill.cancelled { background: #e74c3c; }
    
    .category-bar .bar-fill { background: #3498db; }
    
    .status-info, .category-info {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
    }
    
    .recent-orders {
      background: white;
      padding: 25px;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.08);
    }
    
    .recent-orders h3 {
      margin: 0 0 20px 0;
      color: #2c3e50;
    }
    
    .orders-table {
      display: grid;
      gap: 10px;
    }
    
    .table-header, .table-row {
      display: grid;
      grid-template-columns: 1fr 2fr 1.5fr 1fr 1fr;
      gap: 15px;
      padding: 12px 0;
      align-items: center;
    }
    
    .table-header {
      font-weight: 600;
      color: #2c3e50;
      border-bottom: 2px solid #e9ecef;
    }
    
    .table-row {
      border-bottom: 1px solid #f8f9fa;
    }
    
    .status {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      text-align: center;
    }
    
    .status.pending { background: #fff3cd; color: #856404; }
    .status.processing { background: #d1ecf1; color: #0c5460; }
    .status.shipped { background: #d4edda; color: #155724; }
    .status.delivered { background: #d1ecf1; color: #0c5460; }
    .status.cancelled { background: #f8d7da; color: #721c24; }
  `]
})
export class AnalyticsComponent implements OnInit {
  totalOrders: number = 0;
  totalRevenue: number = 0;
  averageOrder: number = 0;
  pendingOrders: number = 0;
  ordersByStatus: any[] = [];
  revenueByCategory: any[] = [];
  recentOrders: Order[] = [];

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAnalytics();
  }
  
  private getCurrentUser(): string {
    return this.authService.getCurrentUser()?.username || localStorage.getItem('username') || 'admin';
  }
  
  private isSuperAdmin(): boolean {
    return this.authService.isSuperAdmin();
  }

  loadAnalytics(): void {
    this.orderService.getAllOrders().subscribe({
      next: (allOrders) => {
        let orders = allOrders;
        
        // If not superadmin, filter orders for admin's products only
        if (!this.isSuperAdmin()) {
          const currentAdmin = this.getCurrentUser();
          const products = JSON.parse(localStorage.getItem('products') || '[]');
          const adminProducts = products.filter((product: any) => 
            product.adminUsername === currentAdmin || !product.adminUsername
          );
          const adminProductNames = adminProducts.map((p: any) => p.name);
          
          orders = allOrders.filter((order: any) => 
            order.items.some((item: any) => adminProductNames.includes(item.productName))
          );
        }
        
        this.calculateStats(orders);
        this.calculateOrdersByStatus(orders);
        this.calculateRevenueByCategory(orders);
        this.recentOrders = orders.slice(-5).reverse();
      },
      error: (error) => {
        console.error('Error loading analytics:', error);
      }
    });
  }

  calculateStats(orders: Order[]): void {
    // Exclude cancelled orders from revenue calculations
    const activeOrders = orders.filter(order => order.status !== 'cancelled');
    
    this.totalOrders = activeOrders.length;
    this.totalRevenue = activeOrders.reduce((sum, order) => sum + order.total, 0);
    this.averageOrder = this.totalOrders > 0 ? this.totalRevenue / this.totalOrders : 0;
    this.pendingOrders = orders.filter(order => order.status === 'pending').length;
  }

  calculateOrdersByStatus(orders: Order[]): void {
    const statusCounts = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as any);

    this.ordersByStatus = Object.entries(statusCounts).map(([status, count]) => ({
      name: status,
      count: count as number,
      percentage: Math.round(((count as number) / this.totalOrders) * 100)
    }));
  }

  calculateRevenueByCategory(orders: Order[]): void {
    // Exclude cancelled orders from category revenue
    const activeOrders = orders.filter(order => order.status !== 'cancelled');
    
    const categoryRevenue = activeOrders.reduce((acc, order) => {
      order.items.forEach(item => {
        const category = item.category || 'Other';
        acc[category] = (acc[category] || 0) + (item.price * item.quantity);
      });
      return acc;
    }, {} as any);

    const totalCategoryRevenue = Object.values(categoryRevenue).reduce((sum: number, revenue) => sum + (revenue as number), 0);

    this.revenueByCategory = Object.entries(categoryRevenue).map(([category, revenue]) => ({
      name: category,
      revenue: revenue as number,
      percentage: totalCategoryRevenue > 0 ? Math.round(((revenue as number) / totalCategoryRevenue) * 100) : 0
    }));
  }

  goBack(): void {
    this.router.navigate(['/admin']);
  }
}