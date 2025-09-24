import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../models/product.model';
import { getDefaultProductImage, getProductImageUrl } from '../../utils/image-utils';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="header">
      <h1>Products</h1>
      <button class="back-btn" (click)="goBack()">← Back to Dashboard</button>
    </div>

    <div class="products-container">
      <div class="loading" *ngIf="loading">
        <h2>Loading products...</h2>
      </div>
      
      <div class="products-grid" *ngIf="!loading && products.length > 0">
        <div class="product-card" *ngFor="let product of products">
          <div class="product-image">
            <img *ngIf="getProductImageUrl(product)" [src]="getProductImageUrl(product)" [alt]="product.name" />
            <div *ngIf="!getProductImageUrl(product)" class="default-icon">{{getDefaultProductImage(product.category || 'default')}}</div>
          </div>
          <h3>{{product.name}}</h3>
          <p class="description">{{product.description}}</p>
          <p class="category">{{product.category}}</p>
          <div class="stock-info">
            <p class="stock" [class.low-stock]="product.quantity <= 5 && product.quantity > 0" [class.out-of-stock]="product.quantity === 0">
              Stock: {{product.quantity}}
              <span *ngIf="product.quantity === 0" class="stock-status"> - Out of Stock</span>
              <span *ngIf="product.quantity > 0 && product.quantity <= 5" class="stock-status"> - Low Stock!</span>
            </p>
          </div>
          <div class="price">\${{product.price}}</div>
          <button class="add-to-cart-btn" 
                  (click)="addToCart(product)" 
                  [disabled]="product.quantity === 0">
            {{product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}}
          </button>
        </div>
      </div>
      
      <div class="no-products" *ngIf="!loading && products.length === 0">
        <h2>No products available</h2>
        <p>Check back later for new products!</p>
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
    
    .products-container {
      padding: 40px;
      background: #f8f9fa;
      min-height: calc(100vh - 84px);
    }
    
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .product-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      transition: transform 0.3s ease;
      text-align: center;
    }
    
    .product-card:hover {
      transform: translateY(-4px);
    }
    
    .product-image {
      height: 120px;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f8f9fa;
      border-radius: 8px;
    }
    
    .product-image img {
      max-width: 100%;
      max-height: 100%;
      object-fit: cover;
      border-radius: 8px;
    }
    
    .default-icon {
      font-size: 48px;
    }
    
    .category {
      color: #3498db;
      font-size: 12px;
      margin: 0 0 8px 0;
      font-weight: 600;
      text-transform: uppercase;
    }
    
    .product-card h3 {
      font-size: 18px;
      font-weight: 600;
      color: #2c3e50;
      margin: 0 0 12px 0;
    }
    
    .description {
      color: #6c757d;
      font-size: 14px;
      margin: 0 0 8px 0;
      line-height: 1.4;
    }
    
    .stock {
      color: #7f8c8d;
      font-size: 12px;
      margin: 0 0 16px 0;
      font-weight: 500;
    }
    
    .price {
      font-size: 20px;
      font-weight: 700;
      color: #27ae60;
      margin: 0 0 20px 0;
    }
    
    .add-to-cart-btn {
      background: linear-gradient(135deg, #27ae60 0%, #229954 100%);
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      width: 100%;
      transition: all 0.3s ease;
    }
    
    .add-to-cart-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(39, 174, 96, 0.3);
    }
    
    .add-to-cart-btn:disabled {
      background: #bdc3c7;
      cursor: not-allowed;
      transform: none;
    }
    
    .stock.low-stock {
      color: #f39c12;
      font-weight: 600;
    }
    
    .stock.out-of-stock {
      color: #e74c3c;
      font-weight: 600;
    }
    
    .stock-status {
      font-weight: 600;
    }
    
    .no-products {
      text-align: center;
      padding: 60px 20px;
      color: #6c757d;
    }
    
    .no-products h2 {
      color: #2c3e50;
      margin-bottom: 16px;
    }
    
    .loading {
      text-align: center;
      padding: 60px 20px;
      color: #6c757d;
    }
    
    .loading h2 {
      color: #2c3e50;
    }
  `]
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  allProducts: Product[] = [];
  loading: boolean = true;
  selectedCategory: string = '';

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.testConnection();
    this.loadProducts();
    
    this.route.queryParams.subscribe(params => {
      const category = params['category'];
      if (category) {
        this.selectedCategory = category;
        this.filterProductsByCategory(category);
      }
    });
    
    // Listen for stock updates
    window.addEventListener('stockUpdated', () => {
      console.log('Stock updated, reloading products...');
      this.loadProducts();
    });
  }

  testConnection(): void {
    fetch('http://localhost:8082/api/products')
      .then(response => {
        console.log('Connection test - Status:', response.status);
        console.log('Connection test - OK:', response.ok);
        return response.text();
      })
      .then(data => {
        console.log('Connection test - Response:', data);
      })
      .catch(error => {
        console.error('Connection test failed:', error);
      });
  }

  loadProducts(): void {
    this.loading = true;
    console.log('Attempting to load products from:', 'http://localhost:8082/api/products');
    
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        console.log('Successfully loaded products:', products);
        this.allProducts = products || [];
        this.products = products || [];
        this.loading = false;
        
        if (this.selectedCategory) {
          this.filterProductsByCategory(this.selectedCategory);
        }
      },
      error: (error) => {
        console.error('Error loading products:', error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
        this.loading = false;
        
        if (error.status === 0) {
          alert('Cannot connect to server. Please ensure the backend is running on port 8082.');
        } else if (error.status === 404) {
          alert('Products API not found. Please check the backend service.');
        } else {
          alert(`Failed to load products: ${error.message}`);
        }
      }
    });
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

  getDefaultProductImage(category: string | undefined): string {
    return getDefaultProductImage(category || 'default');
  }

  getProductImageUrl(product: Product): string {
    return getProductImageUrl(product);
  }

  filterProductsByCategory(category: string): void {
    if (category && this.allProducts.length > 0) {
      this.products = this.allProducts.filter(product => 
        product.category?.toLowerCase() === category.toLowerCase()
      );
    } else {
      this.products = [...this.allProducts];
    }
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}