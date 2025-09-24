import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { OrderService, Order } from '../../services/order.service';



@Component({
  selector: 'app-order-management',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="header">
      <h1>Order Management</h1>
      <button class="back-btn" (click)="goBack()">← Back to Admin</button>
    </div>

    <div class="container">
      <div class="filters">
        <button class="filter-btn" [class.active]="selectedStatus === 'all'" (click)="filterOrders('all')">
          All Orders ({{orders.length}})
        </button>
        <button class="filter-btn" [class.active]="selectedStatus === 'pending'" (click)="filterOrders('pending')">
          Pending ({{getOrderCount('pending')}})
        </button>
        <button class="filter-btn" [class.active]="selectedStatus === 'processing'" (click)="filterOrders('processing')">
          Processing ({{getOrderCount('processing')}})
        </button>
        <button class="filter-btn" [class.active]="selectedStatus === 'shipped'" (click)="filterOrders('shipped')">
          Shipped ({{getOrderCount('shipped')}})
        </button>
        <button class="filter-btn" [class.active]="selectedStatus === 'delivered'" (click)="filterOrders('delivered')">
          Delivered ({{getOrderCount('delivered')}})
        </button>
      </div>

      <div class="orders-list">
        <div class="order-card" *ngFor="let order of filteredOrders">
          <div class="order-header">
            <div class="order-info">
              <h3>Order #{{order.id}}</h3>
              <p class="customer">{{order.customerName}} ({{order.email}})</p>
              <p class="date">{{order.orderDate | date:'medium'}}</p>
            </div>
            <div class="order-status">
              <select [value]="order.status" (change)="updateOrderStatus(order, $event)">
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <span class="total">\${{order.total.toFixed(2)}}</span>
            </div>
          </div>
          
          <div class="order-items">
            <h4>Order Items:</h4>
            <div class="items-list">
              <div class="item" *ngFor="let item of order.items">
                <span class="item-name">{{item.productName}}</span>
                <span class="item-details">Qty: {{item.quantity}} × \${{item.price}}</span>
              </div>
            </div>
          </div>
          
          <div class="order-actions">
            <button class="view-btn" (click)="viewOrderDetails(order)">View Details</button>
            <button class="print-btn" (click)="printOrder(order)">Print Invoice</button>
            <button class="delete-btn" (click)="deleteOrder(order)">Delete</button>
          </div>
        </div>
      </div>

      <div class="no-orders" *ngIf="filteredOrders.length === 0">
        <div class="empty-state">
          <div class="empty-icon">📋</div>
          <h3>No Orders Found</h3>
          <p>No orders match the selected filter criteria.</p>
        </div>
      </div>
    </div>

    <!-- Order Details Modal -->
    <div class="modal" *ngIf="showOrderDetails" (click)="closeModal()">
      <div class="modal-content" (click)="$event.stopPropagation()" *ngIf="selectedOrder">
        <div class="modal-header">
          <h2>Order Details #{{selectedOrder.id}}</h2>
          <button class="close-btn" (click)="closeModal()">×</button>
        </div>
        <div class="modal-body">
          <div class="customer-info">
            <h3>Customer Information</h3>
            <p><strong>Name:</strong> {{selectedOrder.customerName}}</p>
            <p><strong>Email:</strong> {{selectedOrder.email}}</p>
            <p><strong>Phone:</strong> {{selectedOrder.phone}}</p>
            <p><strong>Address:</strong><br>
              {{selectedOrder.address.street}}<br>
              {{selectedOrder.address.city}}, {{selectedOrder.address.state}} {{selectedOrder.address.zipCode}}<br>
              {{selectedOrder.address.country}}
            </p>
          </div>
          <div class="order-summary">
            <h3>Order Summary</h3>
            <p><strong>Order Date:</strong> {{selectedOrder.orderDate | date:'medium'}}</p>
            <p><strong>Status:</strong> {{selectedOrder.status | titlecase}}</p>
            <p><strong>Subtotal:</strong> \${{selectedOrder.subtotal.toFixed(2)}}</p>
            <p><strong>Tax:</strong> \${{selectedOrder.tax.toFixed(2)}}</p>
            <p><strong>Total:</strong> \${{selectedOrder.total.toFixed(2)}}</p>
          </div>
        </div>
        <div class="modal-actions">
          <button class="invoice-btn" (click)="printOrder(selectedOrder)">View Invoice</button>
          <button class="close-btn" (click)="closeModal()">Close</button>
        </div>
      </div>
    </div>

    <!-- Invoice Modal -->
    <div class="modal" *ngIf="showInvoice" (click)="closeModal()">
      <div class="invoice-content" (click)="$event.stopPropagation()" *ngIf="selectedOrder">
        <div class="invoice-header">
          <div class="company-info">
            <h1>SimpleEcom</h1>
            <p>123 Business Street<br>Commerce City, CC 12345<br>Phone: (555) 123-4567</p>
          </div>
          <div class="invoice-details">
            <h2>INVOICE</h2>
            <p><strong>Invoice #:</strong> INV-{{selectedOrder.id}}</p>
            <p><strong>Date:</strong> {{selectedOrder.orderDate | date:'shortDate'}}</p>
          </div>
        </div>
        
        <div class="bill-to">
          <h3>Bill To:</h3>
          <p><strong>{{selectedOrder.customerName}}</strong><br>
            {{selectedOrder.address.street}}<br>
            {{selectedOrder.address.city}}, {{selectedOrder.address.state}} {{selectedOrder.address.zipCode}}<br>
            {{selectedOrder.address.country}}<br>
            Email: {{selectedOrder.email}}<br>
            Phone: {{selectedOrder.phone}}
          </p>
        </div>
        
        <table class="invoice-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Category</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Tax Rate</th>
              <th>Tax</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of selectedOrder.items">
              <td>{{item.productName}}</td>
              <td>{{item.category}}</td>
              <td>{{item.quantity}}</td>
              <td>\${{item.price.toFixed(2)}}</td>
              <td>{{getTaxRate(item.category)}}%</td>
              <td>\${{item.tax.toFixed(2)}}</td>
              <td>\${{(item.price * item.quantity + item.tax).toFixed(2)}}</td>
            </tr>
          </tbody>
        </table>
        
        <div class="invoice-totals">
          <div class="totals-row">
            <span>Subtotal:</span>
            <span>\${{selectedOrder.subtotal.toFixed(2)}}</span>
          </div>
          <div class="totals-row">
            <span>Total Tax:</span>
            <span>\${{selectedOrder.tax.toFixed(2)}}</span>
          </div>
          <div class="totals-row total">
            <span><strong>Total Amount:</strong></span>
            <span><strong>\${{selectedOrder.total.toFixed(2)}}</strong></span>
          </div>
        </div>
        
        <div class="invoice-footer">
          <p>Thank you for your business!</p>
          <button class="print-btn" onclick="window.print()">Print Invoice</button>
          <button class="close-btn" (click)="closeModal()">Close</button>
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
    
    .filters {
      display: flex;
      gap: 10px;
      margin-bottom: 30px;
      flex-wrap: wrap;
    }
    
    .filter-btn {
      background: white;
      border: 2px solid #e1e8ed;
      color: #6c757d;
      padding: 10px 20px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      transition: all 0.3s ease;
    }
    
    .filter-btn.active {
      background: #3498db;
      border-color: #3498db;
      color: white;
    }
    
    .filter-btn:hover {
      border-color: #3498db;
    }
    
    .orders-list {
      max-width: 1000px;
      margin: 0 auto;
    }
    
    .order-card {
      background: white;
      border-radius: 12px;
      padding: 25px;
      margin-bottom: 20px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.08);
      border: 1px solid #f1f3f4;
    }
    
    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 1px solid #f1f3f4;
    }
    
    .order-info h3 {
      margin: 0 0 8px 0;
      color: #2c3e50;
      font-size: 18px;
    }
    
    .customer {
      color: #3498db;
      margin: 0 0 4px 0;
      font-weight: 600;
    }
    
    .date {
      color: #6c757d;
      margin: 0;
      font-size: 14px;
    }
    
    .order-status {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 10px;
    }
    
    .order-status select {
      padding: 8px 12px;
      border: 2px solid #e1e8ed;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 600;
    }
    
    .total {
      font-size: 20px;
      font-weight: 700;
      color: #27ae60;
    }
    
    .order-items h4 {
      color: #2c3e50;
      margin: 0 0 15px 0;
      font-size: 16px;
    }
    
    .items-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 12px;
      background: #f8f9fa;
      border-radius: 6px;
    }
    
    .item-name {
      font-weight: 600;
      color: #2c3e50;
    }
    
    .item-details {
      color: #6c757d;
      font-size: 14px;
    }
    
    .order-actions {
      display: flex;
      gap: 10px;
      margin-top: 20px;
      padding-top: 15px;
      border-top: 1px solid #f1f3f4;
    }
    
    .view-btn, .print-btn, .delete-btn {
      padding: 10px 20px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      border: none;
    }
    
    .view-btn {
      background: #3498db;
      color: white;
    }
    
    .print-btn {
      background: #95a5a6;
      color: white;
    }
    
    .delete-btn {
      background: #e74c3c;
      color: white;
    }
    
    .delete-btn:hover {
      background: #c0392b;
    }
    
    .no-orders {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 300px;
    }
    
    .empty-state {
      text-align: center;
    }
    
    .empty-icon {
      font-size: 60px;
      margin-bottom: 20px;
    }
    
    .empty-state h3 {
      color: #2c3e50;
      margin-bottom: 10px;
    }
    
    .empty-state p {
      color: #6c757d;
    }
    
    .modal {
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
    
    .modal-content {
      background: white;
      border-radius: 12px;
      padding: 30px;
      max-width: 600px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
    }
    
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      border-bottom: 1px solid #e9ecef;
      padding-bottom: 15px;
    }
    
    .modal-header h2 {
      margin: 0;
      color: #2c3e50;
    }
    
    .close-btn {
      background: #e74c3c;
      color: white;
      border: none;
      padding: 8px 12px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 16px;
    }
    
    .customer-info, .order-summary {
      margin-bottom: 20px;
    }
    
    .customer-info h3, .order-summary h3 {
      color: #2c3e50;
      margin-bottom: 10px;
      border-bottom: 1px solid #e9ecef;
      padding-bottom: 5px;
    }
    
    .modal-actions {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
      margin-top: 20px;
    }
    
    .invoice-btn {
      background: #3498db;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      cursor: pointer;
    }
    
    .invoice-content {
      background: white;
      border-radius: 12px;
      padding: 40px;
      max-width: 800px;
      width: 95%;
      max-height: 90vh;
      overflow-y: auto;
    }
    
    .invoice-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 30px;
      border-bottom: 2px solid #2c3e50;
      padding-bottom: 20px;
    }
    
    .company-info h1 {
      color: #2c3e50;
      margin: 0 0 10px 0;
    }
    
    .invoice-details h2 {
      color: #2c3e50;
      margin: 0 0 10px 0;
    }
    
    .bill-to {
      margin-bottom: 30px;
    }
    
    .bill-to h3 {
      color: #2c3e50;
      margin-bottom: 10px;
    }
    
    .invoice-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
    }
    
    .invoice-table th,
    .invoice-table td {
      border: 1px solid #ddd;
      padding: 12px;
      text-align: left;
    }
    
    .invoice-table th {
      background: #f8f9fa;
      font-weight: 600;
      color: #2c3e50;
    }
    
    .invoice-totals {
      margin-left: auto;
      width: 300px;
      margin-bottom: 30px;
    }
    
    .totals-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #e9ecef;
    }
    
    .totals-row.total {
      border-top: 2px solid #2c3e50;
      border-bottom: 2px solid #2c3e50;
      font-size: 18px;
    }
    
    .invoice-footer {
      text-align: center;
      border-top: 1px solid #e9ecef;
      padding-top: 20px;
    }
    
    .print-btn {
      background: #27ae60;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      cursor: pointer;
      margin-right: 10px;
    }
  `]
})
export class OrderManagementComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  selectedStatus: string = 'all';
  selectedOrder: Order | null = null;
  showOrderDetails: boolean = false;
  showInvoice: boolean = false;

  constructor(
    private router: Router,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    console.log('OrderManagement component initialized');
    
    // Force refresh orders from storage first
    this.orderService.refreshOrders();
    
    // Then load orders
    setTimeout(() => {
      this.loadOrders();
    }, 100);
  }

  loadOrders(): void {
    console.log('Admin loading all orders...');
    this.orderService.getAllOrders().subscribe({
      next: (orders) => {
        console.log('Admin loaded orders:', orders);
        this.orders = orders;
        this.filteredOrders = [...orders];
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.orders = [];
        this.filteredOrders = [];
      }
    });
  }

  filterOrders(status: string): void {
    this.selectedStatus = status;
    if (status === 'all') {
      this.filteredOrders = [...this.orders];
    } else {
      this.filteredOrders = this.orders.filter(order => order.status === status);
    }
  }

  getOrderCount(status: string): number {
    return this.orders.filter(order => order.status === status).length;
  }

  updateOrderStatus(order: Order, event: any): void {
    const newStatus = event.target.value;
    this.orderService.updateOrderStatus(order.id, newStatus).subscribe({
      next: () => {
        order.status = newStatus;
        alert(`Order #${order.id} status updated to: ${newStatus}`);
      },
      error: (error) => {
        console.error('Error updating order status:', error);
        alert('Failed to update order status.');
      }
    });
  }

  viewOrderDetails(order: Order): void {
    this.selectedOrder = order;
    this.showOrderDetails = true;
    this.showInvoice = false;
  }

  printOrder(order: Order): void {
    this.selectedOrder = order;
    this.showInvoice = true;
    this.showOrderDetails = false;
  }

  closeModal(): void {
    this.showOrderDetails = false;
    this.showInvoice = false;
    this.selectedOrder = null;
  }

  deleteOrder(order: Order): void {
    if (confirm(`Delete Order #${order.id}? This action cannot be undone.`)) {
      this.orderService.deleteOrder(order.id).subscribe({
        next: () => {
          this.orders = this.orders.filter(o => o.id !== order.id);
          this.filteredOrders = this.filteredOrders.filter(o => o.id !== order.id);
          alert('Order deleted successfully!');
        },
        error: () => alert('Failed to delete order.')
      });
    }
  }

  getTaxRate(category: string): number {
    switch (category.toLowerCase()) {
      case 'electronics': return 8;
      case 'home': return 5;
      default: return 4;
    }
  }

  goBack(): void {
    this.router.navigate(['/admin']);
  }
}