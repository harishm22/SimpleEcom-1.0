import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

export interface Order {
  id: number;
  customerName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  orderDate: Date;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  subtotal: number;
  tax: number;
  total: number;
  items: Array<{
    productName: string;
    category: string;
    quantity: number;
    price: number;
    tax: number;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  public orders$ = this.ordersSubject.asObservable();

  constructor(private http: HttpClient) {
    console.log('OrderService constructor called');
    this.loadOrdersFromStorage();
  }

  private loadOrdersFromStorage(): void {
    const stored = localStorage.getItem('orders');
    console.log('🔄 Loading orders from storage:', stored);
    if (stored && stored !== 'null' && stored !== '[]') {
      try {
        const orders = JSON.parse(stored).map((order: any) => ({
          ...order,
          orderDate: new Date(order.orderDate)
        }));
        console.log('✅ Parsed orders:', orders);
        this.ordersSubject.next(orders);
      } catch (error) {
        console.error('❌ Error parsing orders:', error);
        this.ordersSubject.next([]);
      }
    } else {
      console.log('📭 No orders found in storage, initializing empty array');
      this.ordersSubject.next([]);
    }
  }

  private saveOrdersToStorage(orders: Order[]): void {
    console.log('Saving orders to storage:', orders);
    localStorage.setItem('orders', JSON.stringify(orders));
    console.log('Orders saved to localStorage');
  }

  getAllOrders(): Observable<Order[]> {
    console.log('getAllOrders called, current orders:', this.ordersSubject.value);
    return this.orders$;
  }

  createOrder(cartItems: any[], customerInfo: any): Observable<Order> {
    return new Observable(observer => {
      const currentOrders = this.ordersSubject.value;
      const newOrderId = Math.max(0, ...currentOrders.map(o => o.id)) + 1;
      
      console.log('=== ORDER CREATION DEBUG ===');
      console.log('Cart items received:', cartItems);
      
      const orderItems = cartItems.map(item => {
        const taxRate = this.getTaxRate(item.category || 'Other');
        const itemTax = (item.price * item.quantity * taxRate) / 100;
        console.log(`Processing item: ${item.productName} (ID: ${item.productId}, Qty: ${item.quantity})`);
        return {
          productId: item.productId, // Store product ID for stock reversion
          productName: item.productName || `Product ${item.productId}`,
          category: item.category || 'Other',
          quantity: item.quantity,
          price: item.price,
          tax: itemTax
        };
      });
      
      console.log('Order items created:', orderItems);

      const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const totalTax = orderItems.reduce((sum, item) => sum + item.tax, 0);

      const newOrder: Order = {
        id: newOrderId,
        customerName: customerInfo.name || customerInfo.username || 'Customer',
        email: customerInfo.email || 'customer@example.com',
        phone: customerInfo.phone || '+1-555-0000',
        address: customerInfo.address || {
          street: '123 Main St',
          city: 'City',
          state: 'State',
          zipCode: '12345',
          country: 'USA'
        },
        orderDate: new Date(),
        status: 'pending',
        subtotal: subtotal,
        tax: totalTax,
        total: subtotal + totalTax,
        items: orderItems
      };
      
      console.log('Created new order:', newOrder);

      const updatedOrders = [...currentOrders, newOrder];
      console.log('📦 Updated orders array:', updatedOrders);
      
      console.log('=== STOCK REDUCTION DEBUG ===');
      console.log('About to reduce stock for cart items:', cartItems);
      
      // Reduce stock quantities
      this.reduceStockQuantities(cartItems);
      
      console.log('Stock reduction completed');
      
      // Save to storage first
      this.saveOrdersToStorage(updatedOrders);
      
      // Then update the subject
      this.ordersSubject.next(updatedOrders);
      
      // Trigger product refresh by dispatching a custom event
      window.dispatchEvent(new CustomEvent('stockUpdated'));
      
      // Verify it was saved
      const verification = localStorage.getItem('orders');
      console.log('✅ Verification - orders in storage:', verification);
      
      observer.next(newOrder);
      observer.complete();
    });
  }

  updateOrderStatus(orderId: number, status: string): Observable<any> {
    return new Observable(observer => {
      const currentOrders = this.ordersSubject.value;
      const orderToUpdate = currentOrders.find(order => order.id === orderId);
      
      // If order is being cancelled, revert stock
      if (orderToUpdate && status === 'cancelled') {
        this.revertStockQuantities(orderToUpdate);
      }
      
      const updatedOrders = currentOrders.map(order => 
        order.id === orderId ? { ...order, status: status as any } : order
      );
      
      this.ordersSubject.next(updatedOrders);
      this.saveOrdersToStorage(updatedOrders);
      
      // Trigger UI refresh
      window.dispatchEvent(new CustomEvent('stockUpdated'));
      
      observer.next({ success: true });
      observer.complete();
    });
  }

  deleteOrder(orderId: number): Observable<any> {
    return new Observable(observer => {
      const currentOrders = this.ordersSubject.value;
      const updatedOrders = currentOrders.filter(order => order.id !== orderId);
      this.ordersSubject.next(updatedOrders);
      this.saveOrdersToStorage(updatedOrders);
      observer.next({ success: true });
      observer.complete();
    });
  }

  refreshOrders(): void {
    console.log('Manually refreshing orders from storage');
    this.loadOrdersFromStorage();
  }

  private reduceStockQuantities(cartItems: any[]): void {
    console.log('Cart items for stock reduction:', cartItems);
    
    // Since products are in backend database, we'll simulate stock reduction
    // by storing reduced quantities in localStorage for frontend display
    const stockReductions = JSON.parse(localStorage.getItem('stockReductions') || '{}');
    
    cartItems.forEach(cartItem => {
      const productId = cartItem.productId || cartItem.id || cartItem.product_id;
      if (productId) {
        // Track how much stock has been reduced for each product
        stockReductions[productId] = (stockReductions[productId] || 0) + cartItem.quantity;
        console.log(`Reduced stock for product ${productId}: reduced by ${cartItem.quantity}, total reduction: ${stockReductions[productId]}`);
      }
    });
    
    localStorage.setItem('stockReductions', JSON.stringify(stockReductions));
    console.log('Stock reductions saved to localStorage:', stockReductions);
  }

  private revertStockQuantities(order: Order): void {
    console.log('Reverting stock for cancelled order:', order.id);
    const stockReductions = JSON.parse(localStorage.getItem('stockReductions') || '{}');
    
    order.items.forEach((item: any) => {
      const productId = item.productId;
      
      if (productId && stockReductions[productId]) {
        const currentReduction = stockReductions[productId];
        const newReduction = Math.max(0, currentReduction - item.quantity);
        
        if (newReduction === 0) {
          delete stockReductions[productId];
        } else {
          stockReductions[productId] = newReduction;
        }
        
        console.log(`Reverted stock for ${item.productName} (ID: ${productId}): ${currentReduction} -> ${newReduction}`);
      }
    });
    
    localStorage.setItem('stockReductions', JSON.stringify(stockReductions));
    console.log('Stock reductions after revert:', stockReductions);
  }

  private getTaxRate(category: string): number {
    switch (category.toLowerCase()) {
      case 'electronics': return 8;
      case 'home': return 5;
      default: return 4;
    }
  }
}