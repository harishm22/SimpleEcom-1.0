import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem } from '../models/product.model';
import { OrderService } from './order.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  public cart$ = this.cartSubject.asObservable();

  constructor(private orderService: OrderService) {
    this.loadCart();
  }

  addToCart(productId: number, price: number, username: string): void {
    const existingItem = this.cartItems.find(item => item.productId === productId);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.cartItems.push({
        productId,
        price,
        quantity: 1,
        username
      });
    }
    
    this.saveCart();
    this.cartSubject.next([...this.cartItems]);
  }

  removeFromCart(productId: number): void {
    this.cartItems = this.cartItems.filter(item => item.productId !== productId);
    this.saveCart();
    this.cartSubject.next([...this.cartItems]);
  }

  updateQuantity(productId: number, quantity: number): void {
    const item = this.cartItems.find(item => item.productId === productId);
    if (item) {
      item.quantity = quantity;
      if (quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        this.saveCart();
        this.cartSubject.next([...this.cartItems]);
      }
    }
  }

  getCartItems(): CartItem[] {
    return [...this.cartItems];
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  clearCart(): void {
    this.cartItems = [];
    this.saveCart();
    this.cartSubject.next([]);
  }

  checkout(customerInfo: any): Observable<any> {
    // Get product details from localStorage
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    
    const cartItems = this.getCartItems().map(item => {
      const product = products.find((p: any) => p.id === item.productId);
      return {
        ...item,
        productName: product ? product.name : `Product ${item.productId}`,
        category: product ? product.category : 'Other'
      };
    });
    
    console.log('Creating order with enriched cart items:', cartItems);
    console.log('Customer info:', customerInfo);
    
    return this.orderService.createOrder(cartItems, customerInfo);
  }

  private saveCart(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }

  private loadCart(): void {
    const saved = localStorage.getItem('cart');
    if (saved) {
      this.cartItems = JSON.parse(saved);
      this.cartSubject.next([...this.cartItems]);
    }
  }
}