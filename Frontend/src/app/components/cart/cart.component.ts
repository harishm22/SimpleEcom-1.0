import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { CartItem, Product } from '../../models/product.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="header">
      <h1>Shopping Cart</h1>
      <button class="back-btn" (click)="goBack()">← Back to Dashboard</button>
    </div>

    <div class="cart-container">
      <div class="cart-content" *ngIf="cartItems.length > 0">
        <div class="cart-items">
          <div class="cart-item" *ngFor="let item of cartItemsWithNames">
            <div class="item-info">
              <h3>{{item.productName}}</h3>
              <p class="price">\${{item.price}}</p>
            </div>
            <div class="quantity-controls">
              <button class="qty-btn" (click)="decreaseQuantity(item)">-</button>
              <span class="quantity">{{item.quantity}}</span>
              <button class="qty-btn" (click)="increaseQuantity(item)">+</button>
            </div>
            <div class="item-total">
              \${{(item.price * item.quantity).toFixed(2)}}
            </div>
            <button class="remove-btn" (click)="removeItem(item)">×</button>
          </div>
        </div>
        
        <div class="cart-summary">
          <div class="total">
            <h2>Total: \${{getTotalPrice().toFixed(2)}}</h2>
          </div>
          <button class="checkout-btn" (click)="proceedToCheckout()">
            Proceed to Checkout
          </button>
          <button class="clear-btn" (click)="clearCart()">
            Clear Cart
          </button>
        </div>
      </div>
      
      <div class="empty-cart" *ngIf="cartItems.length === 0">
        <div class="empty-icon">🛒</div>
        <h2>Your cart is empty</h2>
        <p>Add some products to get started!</p>
        <button class="shop-btn" (click)="goToProducts()">Start Shopping</button>
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
    
    .back-btn:hover {
      background: rgba(255,255,255,0.3);
    }
    
    .cart-container {
      padding: 40px;
      background: #f8f9fa;
      min-height: calc(100vh - 84px);
    }
    
    .cart-content {
      max-width: 800px;
      margin: 0 auto;
    }
    
    .cart-items {
      background: white;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 24px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    }
    
    .cart-item {
      display: grid;
      grid-template-columns: 1fr auto auto auto;
      gap: 20px;
      align-items: center;
      padding: 20px 0;
      border-bottom: 1px solid #f1f3f4;
    }
    
    .cart-item:last-child {
      border-bottom: none;
    }
    
    .item-info h3 {
      margin: 0 0 8px 0;
      color: #2c3e50;
      font-size: 18px;
    }
    
    .price {
      color: #27ae60;
      font-weight: 600;
      margin: 0;
    }
    
    .quantity-controls {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .qty-btn {
      background: #3498db;
      color: white;
      border: none;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 18px;
      font-weight: bold;
    }
    
    .qty-btn:hover {
      background: #2980b9;
    }
    
    .quantity {
      font-weight: 600;
      font-size: 16px;
      min-width: 20px;
      text-align: center;
    }
    
    .item-total {
      font-size: 18px;
      font-weight: 700;
      color: #2c3e50;
    }
    
    .remove-btn {
      background: #e74c3c;
      color: white;
      border: none;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 18px;
      font-weight: bold;
    }
    
    .remove-btn:hover {
      background: #c0392b;
    }
    
    .cart-summary {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      text-align: center;
    }
    
    .total h2 {
      color: #2c3e50;
      margin: 0 0 24px 0;
      font-size: 24px;
    }
    
    .checkout-btn {
      background: linear-gradient(135deg, #27ae60 0%, #229954 100%);
      color: white;
      border: none;
      padding: 16px 32px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      width: 100%;
      margin-bottom: 12px;
      transition: all 0.3s ease;
    }
    
    .checkout-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(39, 174, 96, 0.3);
    }
    
    .clear-btn {
      background: transparent;
      color: #e74c3c;
      border: 2px solid #e74c3c;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 14px;
      cursor: pointer;
      width: 100%;
    }
    
    .clear-btn:hover {
      background: #e74c3c;
      color: white;
    }
    
    .empty-cart {
      text-align: center;
      padding: 80px 20px;
      max-width: 400px;
      margin: 0 auto;
    }
    
    .empty-icon {
      font-size: 80px;
      margin-bottom: 24px;
    }
    
    .empty-cart h2 {
      color: #2c3e50;
      margin-bottom: 16px;
    }
    
    .empty-cart p {
      color: #6c757d;
      margin-bottom: 32px;
    }
    
    .shop-btn {
      background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
      color: white;
      border: none;
      padding: 16px 32px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
    }
    
    .shop-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(52, 152, 219, 0.3);
    }
  `]
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  cartItemsWithNames: any[] = [];

  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe(items => {
      this.cartItems = items;
      this.loadProductNames();
    });
  }

  loadProductNames(): void {
    this.cartItemsWithNames = [];
    this.cartItems.forEach(item => {
      this.productService.getProductById(item.productId).subscribe({
        next: (product) => {
          this.cartItemsWithNames.push({
            ...item,
            productName: product.name
          });
        },
        error: (error) => {
          this.cartItemsWithNames.push({
            ...item,
            productName: 'Unknown Product'
          });
        }
      });
    });
  }

  increaseQuantity(item: CartItem): void {
    this.cartService.updateQuantity(item.productId, item.quantity + 1);
  }

  decreaseQuantity(item: CartItem): void {
    this.cartService.updateQuantity(item.productId, item.quantity - 1);
  }

  removeItem(item: CartItem): void {
    this.cartService.removeFromCart(item.productId);
  }

  getTotalPrice(): number {
    return this.cartService.getTotalPrice();
  }

  clearCart(): void {
    if (confirm('Are you sure you want to clear your cart?')) {
      this.cartService.clearCart();
    }
  }

  proceedToCheckout(): void {
    this.router.navigate(['/checkout']);
  }

  goToProducts(): void {
    this.router.navigate(['/products']);
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}