import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { CartItem } from '../../models/product.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="header">
      <h1>Checkout</h1>
      <button class="back-btn" (click)="goBack()">← Back to Cart</button>
    </div>

    <div class="checkout-container">
      <div class="checkout-content">
        <div class="order-summary">
          <h2>Order Summary</h2>
          <div class="order-items">
            <div class="order-item" *ngFor="let item of cartItemsWithNames">
              <span class="item-name">{{item.productName}}</span>
              <span class="item-qty">×{{item.quantity}}</span>
              <span class="item-price">\${{(item.price * item.quantity).toFixed(2)}}</span>
            </div>
          </div>
          <div class="total-section">
            <div class="total-line">
              <span>Subtotal:</span>
              <span>\${{getTotalPrice().toFixed(2)}}</span>
            </div>
            <div class="total-line">
              <span>Shipping:</span>
              <span>\$5.99</span>
            </div>
            <div class="total-line final-total">
              <span>Total:</span>
              <span>\${{(getTotalPrice() + 5.99).toFixed(2)}}</span>
            </div>
          </div>
        </div>

        <div class="delivery-form">
          <h2>Delivery Information</h2>
          <form [formGroup]="deliveryForm" (ngSubmit)="onSubmit()">
            <div class="form-row">
              <div class="form-field">
                <label>First Name</label>
                <input type="text" formControlName="firstName" placeholder="Enter first name" required>
              </div>
              <div class="form-field">
                <label>Last Name</label>
                <input type="text" formControlName="lastName" placeholder="Enter last name" required>
              </div>
            </div>

            <div class="form-field">
              <label>Email</label>
              <input type="email" formControlName="email" placeholder="Enter email address" required>
            </div>

            <div class="form-field">
              <label>Phone Number</label>
              <input type="tel" formControlName="phone" placeholder="Enter phone number" required>
            </div>

            <div class="form-field">
              <label>Street Address</label>
              <input type="text" formControlName="address" placeholder="Enter street address" required>
            </div>

            <div class="form-row">
              <div class="form-field">
                <label>City</label>
                <input type="text" formControlName="city" placeholder="Enter city" required>
              </div>
              <div class="form-field">
                <label>State</label>
                <input type="text" formControlName="state" placeholder="Enter state" required>
              </div>
              <div class="form-field">
                <label>ZIP Code</label>
                <input type="text" formControlName="zipCode" placeholder="Enter ZIP code" required>
              </div>
            </div>

            <div class="form-field">
              <label>Delivery Instructions (Optional)</label>
              <textarea formControlName="instructions" placeholder="Any special delivery instructions..." rows="3"></textarea>
            </div>

            <button type="submit" class="place-order-btn" [disabled]="deliveryForm.invalid || cartItems.length === 0">
              Place Order - \${{(getTotalPrice() + 5.99).toFixed(2)}}
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .header {
      background: linear-gradient(135deg, #27ae60 0%, #229954 100%);
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
    
    .checkout-container {
      padding: 40px;
      background: #f8f9fa;
      min-height: calc(100vh - 84px);
    }
    
    .checkout-content {
      max-width: 1000px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr 1.5fr;
      gap: 40px;
    }
    
    .order-summary {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      height: fit-content;
    }
    
    .order-summary h2 {
      margin: 0 0 20px 0;
      color: #2c3e50;
      font-size: 20px;
    }
    
    .order-item {
      display: grid;
      grid-template-columns: 1fr auto auto;
      gap: 12px;
      padding: 12px 0;
      border-bottom: 1px solid #f1f3f4;
    }
    
    .order-item:last-child {
      border-bottom: none;
    }
    
    .item-name {
      color: #2c3e50;
      font-weight: 500;
    }
    
    .item-qty {
      color: #6c757d;
      font-size: 14px;
    }
    
    .item-price {
      color: #27ae60;
      font-weight: 600;
    }
    
    .total-section {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 2px solid #f1f3f4;
    }
    
    .total-line {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      color: #2c3e50;
    }
    
    .final-total {
      font-size: 18px;
      font-weight: 700;
      padding-top: 12px;
      border-top: 1px solid #f1f3f4;
      margin-top: 12px;
    }
    
    .delivery-form {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    }
    
    .delivery-form h2 {
      margin: 0 0 24px 0;
      color: #2c3e50;
      font-size: 20px;
    }
    
    .form-field {
      margin-bottom: 20px;
    }
    
    .form-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 16px;
    }
    
    .form-field label {
      display: block;
      color: #2c3e50;
      font-weight: 600;
      margin-bottom: 6px;
      font-size: 14px;
    }
    
    .form-field input,
    .form-field textarea {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid #e1e8ed;
      border-radius: 8px;
      font-size: 16px;
      transition: border-color 0.3s;
      box-sizing: border-box;
    }
    
    .form-field input:focus,
    .form-field textarea:focus {
      outline: none;
      border-color: #27ae60;
    }
    
    .place-order-btn {
      background: linear-gradient(135deg, #27ae60 0%, #229954 100%);
      color: white;
      border: none;
      padding: 16px 32px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      width: 100%;
      margin-top: 20px;
      transition: all 0.3s ease;
    }
    
    .place-order-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(39, 174, 96, 0.3);
    }
    
    .place-order-btn:disabled {
      background: #bdc3c7;
      cursor: not-allowed;
      transform: none;
    }
    
    @media (max-width: 768px) {
      .checkout-content {
        grid-template-columns: 1fr;
        gap: 24px;
      }
    }
  `]
})
export class CheckoutComponent implements OnInit {
  cartItems: CartItem[] = [];
  cartItemsWithNames: any[] = [];
  deliveryForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private productService: ProductService,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {
    this.deliveryForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required],
      instructions: ['']
    });
  }

  ngOnInit(): void {
    console.log('🛒 Checkout component initialized');
    this.cartService.cart$.subscribe(items => {
      console.log('📦 Cart items received:', items);
      this.cartItems = items;
      if (items.length === 0) {
        console.log('⚠️ No items in cart, redirecting to cart page');
        this.router.navigate(['/cart']);
      } else {
        console.log('✅ Loading product names for', items.length, 'items');
        this.loadProductNames();
      }
    });
  }

  loadProductNames(): void {
    console.log('📝 Loading product names for cart items');
    this.cartItemsWithNames = [];
    this.cartItems.forEach(item => {
      console.log('🔍 Getting product details for ID:', item.productId);
      this.productService.getProductById(item.productId).subscribe({
        next: (product) => {
          console.log('✅ Product found:', product.name);
          this.cartItemsWithNames.push({
            ...item,
            productName: product.name,
            category: product.category || 'Other'
          });
          console.log('📝 Updated cartItemsWithNames:', this.cartItemsWithNames);
        },
        error: (error) => {
          console.log('❌ Product not found for ID:', item.productId);
          this.cartItemsWithNames.push({
            ...item,
            productName: 'Unknown Product',
            category: 'Other'
          });
        }
      });
    });
  }

  getTotalPrice(): number {
    return this.cartService.getTotalPrice();
  }

  onSubmit(): void {
    console.log('=== CHECKOUT DEBUG START ===');
    console.log('1. Form submitted');
    console.log('2. Form valid:', this.deliveryForm.valid);
    console.log('3. Cart items count:', this.cartItems.length);
    console.log('4. Cart items with names:', this.cartItemsWithNames);
    
    if (this.deliveryForm.valid && this.cartItems.length > 0) {
      console.log('5. Validation passed, proceeding...');
      const formData = this.deliveryForm.value;
      const currentUser = this.authService.getCurrentUser()?.username || localStorage.getItem('username') || 'user';
      
      const customerInfo = {
        name: currentUser,
        username: currentUser,
        email: formData.email,
        phone: formData.phone,
        address: {
          street: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: 'USA'
        }
      };
      
      const cartItemsForOrder = this.cartItemsWithNames.map(item => ({
        ...item,
        category: item.category || 'Other'
      }));
      
      console.log('📦 Final cart items for order:', cartItemsForOrder);
      
      console.log('Creating order with customer info:', customerInfo);
      console.log('Cart items for order:', cartItemsForOrder);
      
      console.log('11. About to call orderService.createOrder');
      console.log('12. OrderService exists:', !!this.orderService);
      
      this.orderService.createOrder(cartItemsForOrder, customerInfo).subscribe({
        next: (order) => {
          console.log('13. ✅ Order created successfully:', order);
          console.log('14. Order ID:', order.id);
          console.log('15. Order customer name:', order.customerName);
          console.log('16. Current user:', customerInfo.username);
          alert('Order placed successfully! You will receive a confirmation email shortly.');
          this.cartService.clearCart();
          
          // Check what's in localStorage
          const storedOrders = localStorage.getItem('orders');
          console.log('💾 Orders in localStorage after creation:', storedOrders);
          
          // Force refresh and navigate
          this.orderService.refreshOrders();
          setTimeout(() => {
            console.log('🔄 Navigating to order history');
            this.router.navigate(['/order-history']);
          }, 1000);
        },
        error: (error) => {
          console.log('ERROR: Order creation failed');
          console.error('Error details:', error);
          console.error('Error message:', error.message);
          console.error('Error stack:', error.stack);
          alert('Failed to place order. Check console for details.');
        }
      });
    } else {
      console.log('VALIDATION FAILED:');
      console.log('- Form valid:', this.deliveryForm.valid);
      console.log('- Form errors:', this.deliveryForm.errors);
      console.log('- Cart items:', this.cartItems.length);
      if (!this.deliveryForm.valid) {
        Object.keys(this.deliveryForm.controls).forEach(key => {
          const control = this.deliveryForm.get(key);
          if (control && control.invalid) {
            console.log(`- ${key} errors:`, control.errors);
          }
        });
      }
    }
    console.log('=== CHECKOUT DEBUG END ===');
  }

  goBack(): void {
    this.router.navigate(['/cart']);
  }
}