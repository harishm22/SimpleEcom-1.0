import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { getDefaultProductImage, getProductImageUrl } from '../../utils/image-utils';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [
    CommonModule
  ],
  template: `
    <div class="header">
      <div class="header-content">
        <h1>Welcome, {{username}}!</h1>
        <div class="header-actions">
          <button class="cart-btn" (click)="viewCart()">
            🛒 Cart <span class="cart-count" *ngIf="cartItemCount > 0">({{cartItemCount}})</span>
          </button>

          <button class="logout-btn" (click)="logout()">Logout</button>
        </div>
      </div>
    </div>

    <div class="main-content">
      <div class="categories">
        <h2>Shop by Category</h2>
        <div class="category-grid">
          <div class="category-card" *ngFor="let category of categories" (click)="filterByCategory(category.name)">
            <div class="category-icon">{{category.icon}}</div>
            <span>{{category.name}}</span>
          </div>
        </div>
      </div>

      <div class="products-section">
        <div class="section-header">
          <h2>Featured Products</h2>
          <button class="view-all-btn" (click)="viewProducts()">View All Products</button>
          <button class="order-history-btn" (click)="viewOrderHistory()">Order History</button>
        </div>
        
        <div class="loading" *ngIf="loading">
          <p>Loading products...</p>
        </div>
        
        <div class="products-grid" *ngIf="!loading && products.length > 0">
          <div class="product-card" *ngFor="let product of products.slice(0, 6)">
            <div class="product-image">
              <img *ngIf="getProductImageUrl(product)" [src]="getProductImageUrl(product)" [alt]="product.name" />
              <div *ngIf="!getProductImageUrl(product)" class="default-icon">{{getDefaultProductImage(product.category || 'default')}}</div>
            </div>
            <div class="product-info">
              <h3>{{product.name}}</h3>
              <p class="category">{{product.category}}</p>
              <p class="description">{{product.description}}</p>
              <div class="product-footer">
                <span class="price">\${{product.price}}</span>
                <div class="stock-info" *ngIf="product.quantity <= 5">
                  <span class="stock-warning" *ngIf="product.quantity > 0 && product.quantity <= 5">
                    Only {{product.quantity}} left!
                  </span>
                  <span class="out-of-stock" *ngIf="product.quantity === 0">
                    Out of Stock
                  </span>
                </div>
                <button class="add-to-cart" 
                        (click)="addToCart(product)" 
                        [disabled]="product.quantity === 0">
                  {{product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div class="no-products" *ngIf="!loading && products.length === 0">
          <p>No products available at the moment.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px 0;
    }
    
    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 600;
    }
    
    .header-actions {
      display: flex;
      gap: 15px;
    }
    
    .cart-btn, .logout-btn {
      background: rgba(255,255,255,0.2);
      border: 1px solid rgba(255,255,255,0.3);
      color: white;
      padding: 10px 20px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.3s ease;
    }
    
    .cart-btn:hover, .logout-btn:hover {
      background: rgba(255,255,255,0.3);
    }
    
    .cart-count {
      background: #e74c3c;
      padding: 2px 6px;
      border-radius: 10px;
      font-size: 12px;
      margin-left: 5px;
    }
    
    .main-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    
    .categories {
      margin-bottom: 50px;
    }
    
    .categories h2 {
      color: #2c3e50;
      margin-bottom: 20px;
      font-size: 24px;
    }
    
    .category-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 20px;
    }
    
    .category-card {
      background: white;
      padding: 20px;
      border-radius: 12px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(0,0,0,0.08);
      border: 1px solid #f1f3f4;
    }
    
    .category-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    }
    
    .category-icon {
      font-size: 32px;
      margin-bottom: 10px;
    }
    
    .category-card span {
      font-weight: 600;
      color: #2c3e50;
    }
    
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }
    
    .section-header h2 {
      color: #2c3e50;
      margin: 0;
      font-size: 24px;
    }
    
    .view-all-btn, .order-history-btn {
      background: #3498db;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.3s ease;
    }
    
    .order-history-btn {
      background: #9b59b6;
      margin-left: 10px;
    }
    
    .view-all-btn:hover {
      background: #2980b9;
    }
    
    .order-history-btn:hover {
      background: #8e44ad;
    }
    
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 25px;
    }
    
    .product-card {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0,0,0,0.08);
      transition: all 0.3s ease;
      border: 1px solid #f1f3f4;
    }
    
    .product-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    }
    
    .product-image {
      height: 200px;
      background: #f8f9fa;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .product-image img {
      max-width: 100%;
      max-height: 100%;
      object-fit: cover;
    }
    
    .default-icon {
      font-size: 48px;
    }
    
    .product-info {
      padding: 20px;
    }
    
    .product-info h3 {
      margin: 0 0 8px 0;
      color: #2c3e50;
      font-size: 18px;
      font-weight: 600;
    }
    
    .category {
      color: #3498db;
      font-size: 12px;
      margin: 0 0 8px 0;
      font-weight: 600;
      text-transform: uppercase;
    }
    
    .description {
      color: #6c757d;
      font-size: 14px;
      margin: 0 0 15px 0;
      line-height: 1.4;
    }
    
    .product-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .price {
      font-size: 20px;
      font-weight: 700;
      color: #27ae60;
    }
    
    .add-to-cart {
      background: #27ae60;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      transition: all 0.3s ease;
    }
    
    .add-to-cart:hover:not(:disabled) {
      background: #219a52;
    }
    
    .add-to-cart:disabled {
      background: #bdc3c7;
      cursor: not-allowed;
    }
    
    .stock-info {
      font-size: 12px;
      margin: 5px 0;
    }
    
    .stock-warning {
      color: #f39c12;
      font-weight: 600;
    }
    
    .out-of-stock {
      color: #e74c3c;
      font-weight: 600;
    }
    
    .loading {
      text-align: center;
      padding: 40px;
      color: #6c757d;
    }
    
    .no-products {
      text-align: center;
      padding: 40px;
      color: #6c757d;
    }
  `]
})
export class UserDashboardComponent implements OnInit {
  username: string = '';
  cartItemCount: number = 0;
  products: Product[] = [];
  loading: boolean = true;
  categories = [
    { name: 'Electronics', icon: '📱' },
    { name: 'Food', icon: '🍕' },
    { name: 'Clothing', icon: '👕' },
    { name: 'Books', icon: '📚' },
    { name: 'Home', icon: '🏠' },
    { name: 'Sports', icon: '⚽' }
  ];

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.username = user?.username || localStorage.getItem('username') || 'User';
    
    this.cartService.cart$.subscribe(items => {
      this.cartItemCount = items.reduce((total, item) => total + item.quantity, 0);
    });
    
    this.loadProducts();
    
    // Listen for stock updates
    window.addEventListener('stockUpdated', () => {
      console.log('Stock updated, reloading products...');
      this.loadProducts();
    });
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products || [];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.loading = false;
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  viewProducts(): void {
    this.router.navigate(['/products']);
  }

  viewCart(): void {
    this.router.navigate(['/cart']);
  }

  viewOrderHistory(): void {
    this.router.navigate(['/order-history']);
  }

  quickCheckout(): void {
    const cartItems = this.cartService.getCartItems();
    if (cartItems.length === 0) {
      alert('Your cart is empty. Add some products first!');
      return;
    }
    
    const customerInfo = {
      name: this.username,
      username: this.username,
      email: `${this.username}@example.com`,
      phone: '+1-555-0000',
      address: {
        street: '123 Main St',
        city: 'City',
        state: 'State',
        zipCode: '12345',
        country: 'USA'
      }
    };
    
    console.log('=== CHECKOUT DEBUG ===');
    console.log('Cart items before checkout:', this.cartService.getCartItems());
    console.log('Customer info:', customerInfo);
    
    this.cartService.checkout(customerInfo).subscribe({
      next: (order) => {
        console.log('Order created successfully:', order);
        alert(`Order #${order.id} created successfully! Total: $${order.total.toFixed(2)}`);
        this.cartService.clearCart();
        
        // Force reload products to show updated stock
        setTimeout(() => {
          console.log('Reloading products after checkout...');
          this.loadProducts();
        }, 500);
      },
      error: (error) => {
        console.error('Checkout error:', error);
        alert('Failed to create order. Please try again.');
      }
    });
  }

  viewProfile(): void {
    alert('Profile page - Coming soon! This will show your account settings.');
  }

  addToCart(product: Product): void {
    if (product.quantity === 0) {
      alert('This product is out of stock!');
      return;
    }
    
    const username = this.authService.getCurrentUser()?.username || localStorage.getItem('username') || 'user';
    this.cartService.addToCart(product.id!, product.price, username);
    alert(`${product.name} added to cart!`);
  }

  filterByCategory(category: string): void {
    this.router.navigate(['/products'], { queryParams: { category: category } });
  }

  getDefaultProductImage(category: string | undefined): string {
    return getDefaultProductImage(category || 'default');
  }

  getProductImageUrl(product: Product): string {
    return getProductImageUrl(product);
  }
}