import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { OrderService, Order } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="header">
      <h1>My Order History</h1>
      <div class="header-actions">
        <button class="clear-history-btn" (click)="clearOrderHistory()" *ngIf="userOrders.length > 0">Clear History</button>
        <button class="back-btn" (click)="goBack()">← Back to Dashboard</button>
      </div>
    </div>

    <div class="container">
      <div class="orders-list" *ngIf="userOrders.length > 0">
        <div class="order-card" *ngFor="let order of userOrders">
          <div class="order-header">
            <div class="order-info">
              <h3>Order #{{order.id}}</h3>
              <p class="date">{{order.orderDate | date:'medium'}}</p>
              <span class="status" [class]="order.status">{{order.status | titlecase}}</span>
            </div>
            <div class="order-total">
              <span class="total">\${{order.total.toFixed(2)}}</span>
            </div>
          </div>
          
          <div class="order-items">
            <div class="item" *ngFor="let item of order.items">
              <span class="item-name">{{item.productName}}</span>
              <span class="item-details">{{item.quantity}} × \${{item.price}}</span>
            </div>
          </div>
          
          <div class="order-actions">
            <button class="view-btn" (click)="viewOrder(order)">View Details</button>
            <button class="cancel-btn" (click)="cancelOrder(order)" *ngIf="order.status === 'pending' || order.status === 'processing'">Cancel Order</button>
          </div>
        </div>
      </div>

      <div class="no-orders" *ngIf="userOrders.length === 0">
        <div class="empty-state">
          <div class="empty-icon">📦</div>
          <h3>No Orders Yet</h3>
          <p>You haven't placed any orders yet. Start shopping to see your order history here.</p>
          <button class="shop-btn" (click)="goShopping()">Start Shopping</button>
        </div>
      </div>
    </div>

    <!-- Order Details View -->
    <div class="order-details-overlay" *ngIf="selectedOrder" (click)="closeOrderDetails()">
      <div class="order-details-page" (click)="$event.stopPropagation()">
        <div class="details-header">
          <h2>Order Details #{{selectedOrder.id}}</h2>
          <button class="close-btn" (click)="closeOrderDetails()">×</button>
        </div>
        
        <div class="details-content">
          <div class="customer-section">
            <h3>Customer Information</h3>
            <div class="info-grid">
              <div class="info-item">
                <label>Name:</label>
                <span>{{selectedOrder.customerName}}</span>
              </div>
              <div class="info-item">
                <label>Email:</label>
                <span>{{selectedOrder.email}}</span>
              </div>
              <div class="info-item">
                <label>Phone:</label>
                <span>{{selectedOrder.phone}}</span>
              </div>
            </div>
          </div>
          
          <div class="address-section">
            <h3>Delivery Address</h3>
            <div class="address-box">
              <p>{{selectedOrder.address.street}}</p>
              <p>{{selectedOrder.address.city}}, {{selectedOrder.address.state}} {{selectedOrder.address.zipCode}}</p>
              <p>{{selectedOrder.address.country}}</p>
            </div>
          </div>
          
          <div class="order-info-section">
            <h3>Order Information</h3>
            <div class="info-grid">
              <div class="info-item">
                <label>Order Date:</label>
                <span>{{selectedOrder.orderDate | date:'medium'}}</span>
              </div>
              <div class="info-item">
                <label>Status:</label>
                <span class="status" [class]="selectedOrder.status">{{selectedOrder.status | titlecase}}</span>
              </div>
            </div>
          </div>
          
          <div class="products-section">
            <h3>Products Ordered</h3>
            <div class="products-list">
              <div class="product-item" *ngFor="let item of selectedOrder.items">
                <div class="product-info">
                  <h4>{{item.productName}}</h4>
                  <p class="category">{{item.category}}</p>
                </div>
                <div class="product-details">
                  <span class="quantity">Qty: {{item.quantity}}</span>
                  <span class="price">\${{item.price.toFixed(2)}} each</span>
                  <span class="total">\${{(item.price * item.quantity).toFixed(2)}}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="order-summary">
            <div class="summary-row">
              <span>Subtotal:</span>
              <span>\${{selectedOrder.subtotal.toFixed(2)}}</span>
            </div>
            <div class="summary-row">
              <span>Tax:</span>
              <span>\${{selectedOrder.tax.toFixed(2)}}</span>
            </div>
            <div class="summary-row total-row">
              <span>Total:</span>
              <span>\${{selectedOrder.total.toFixed(2)}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .header {
      background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
      color: white;
      padding: 20px 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .header-actions {
      display: flex;
      gap: 10px;
    }
    
    .clear-history-btn {
      background: rgba(231, 76, 60, 0.8);
      border: 1px solid rgba(231, 76, 60, 0.9);
      color: white;
      padding: 10px 20px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
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
    
    .order-card {
      background: white;
      border-radius: 12px;
      padding: 25px;
      margin-bottom: 20px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.08);
    }
    
    .order-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 15px;
      padding-bottom: 15px;
      border-bottom: 1px solid #f1f3f4;
    }
    
    .status {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
    }
    
    .status.pending { background: #fff3cd; color: #856404; }
    .status.processing { background: #d1ecf1; color: #0c5460; }
    .status.shipped { background: #d4edda; color: #155724; }
    .status.delivered { background: #d1ecf1; color: #0c5460; }
    .status.cancelled { background: #f8d7da; color: #721c24; }
    
    .total {
      font-size: 20px;
      font-weight: 700;
      color: #27ae60;
    }
    
    .item {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
    }
    
    .order-actions {
      display: flex;
      gap: 10px;
    }
    
    .view-btn, .cancel-btn, .shop-btn {
      padding: 8px 16px;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      border: none;
    }
    
    .view-btn { background: #3498db; color: white; }
    .cancel-btn { background: #e74c3c; color: white; }
    .shop-btn { background: #27ae60; color: white; }
    
    .empty-state {
      text-align: center;
      padding: 60px;
    }
    
    .empty-icon { font-size: 60px; margin-bottom: 20px; }
    
    .order-details-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    
    .order-details-page {
      background: white;
      border-radius: 12px;
      width: 90%;
      max-width: 800px;
      max-height: 90vh;
      overflow-y: auto;
    }
    
    .details-header {
      background: #3498db;
      color: white;
      padding: 20px;
      border-radius: 12px 12px 0 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .details-header h2 { margin: 0; }
    
    .close-btn {
      background: none;
      border: none;
      color: white;
      font-size: 24px;
      cursor: pointer;
      padding: 5px;
    }
    
    .details-content {
      padding: 30px;
    }
    
    .customer-section, .address-section, .order-info-section, .products-section {
      margin-bottom: 30px;
    }
    
    .customer-section h3, .address-section h3, .order-info-section h3, .products-section h3 {
      color: #2c3e50;
      margin-bottom: 15px;
      border-bottom: 2px solid #e9ecef;
      padding-bottom: 8px;
    }
    
    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 15px;
    }
    
    .info-item {
      display: flex;
      flex-direction: column;
    }
    
    .info-item label {
      font-weight: 600;
      color: #6c757d;
      font-size: 14px;
      margin-bottom: 5px;
    }
    
    .info-item span {
      color: #2c3e50;
      font-size: 16px;
    }
    
    .address-box {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 8px;
      border-left: 4px solid #3498db;
    }
    
    .address-box p {
      margin: 5px 0;
      color: #2c3e50;
    }
    
    .products-list {
      border: 1px solid #e9ecef;
      border-radius: 8px;
      overflow: hidden;
    }
    
    .product-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px;
      border-bottom: 1px solid #e9ecef;
    }
    
    .product-item:last-child {
      border-bottom: none;
    }
    
    .product-info h4 {
      margin: 0 0 5px 0;
      color: #2c3e50;
    }
    
    .category {
      color: #6c757d;
      font-size: 12px;
      margin: 0;
    }
    
    .product-details {
      display: flex;
      gap: 15px;
      align-items: center;
    }
    
    .quantity, .price {
      color: #6c757d;
      font-size: 14px;
    }
    
    .total {
      font-weight: 600;
      color: #27ae60;
    }
    
    .order-summary {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      margin-top: 20px;
    }
    
    .summary-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
    }
    
    .total-row {
      border-top: 2px solid #2c3e50;
      padding-top: 10px;
      font-weight: 700;
      font-size: 18px;
      color: #2c3e50;
    }
  `]
})
export class OrderHistoryComponent implements OnInit {
  userOrders: Order[] = [];
  currentUsername: string = '';
  selectedOrder: Order | null = null;

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUsername = this.authService.getCurrentUser()?.username || localStorage.getItem('username') || '';
    console.log('OrderHistory component initialized for user:', this.currentUsername);
    
    // Force refresh orders from storage first
    this.orderService.refreshOrders();
    
    // Then load user orders
    setTimeout(() => {
      this.loadUserOrders();
    }, 100);
  }

  loadUserOrders(): void {
    console.log('Loading orders for user:', this.currentUsername);
    this.orderService.getAllOrders().subscribe({
      next: (orders) => {
        console.log('All orders loaded:', orders);
        this.userOrders = orders.filter(order => {
          const matchByName = order.customerName === this.currentUsername;
          const matchByUsername = order.customerName.toLowerCase().includes(this.currentUsername.toLowerCase());
          const matchByEmail = order.email && order.email.toLowerCase().includes(this.currentUsername.toLowerCase());
          const match = matchByName || matchByUsername || matchByEmail;
          console.log(`Order ${order.id}: customer='${order.customerName}', email='${order.email}', user='${this.currentUsername}', match=${match}`);
          return match;
        });
        console.log('Filtered user orders:', this.userOrders);
      },
      error: (error) => {
        console.error('Error loading orders:', error);
      }
    });
  }

  viewOrder(order: Order): void {
    this.selectedOrder = order;
  }

  closeOrderDetails(): void {
    this.selectedOrder = null;
  }

  cancelOrder(order: Order): void {
    if (confirm(`Cancel Order #${order.id}?`)) {
      this.orderService.updateOrderStatus(order.id, 'cancelled').subscribe({
        next: () => {
          order.status = 'cancelled';
          alert('Order cancelled successfully!');
        },
        error: () => alert('Failed to cancel order.')
      });
    }
  }

  goShopping(): void {
    this.router.navigate(['/products']);
  }

  clearOrderHistory(): void {
    if (confirm('Clear all order history? This cannot be undone.')) {
      localStorage.removeItem('orders');
      this.orderService.refreshOrders();
      this.userOrders = [];
      alert('Order history cleared successfully!');
    }
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}