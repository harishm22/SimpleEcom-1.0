import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../models/product.model';
import { getDefaultProductImage, getProductImageUrl } from '../../utils/image-utils';

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="header">
      <h1>Product Management</h1>
      <div class="header-actions">
        <button class="add-btn" (click)="addProduct()">+ Add New Product</button>
        <button class="back-btn" (click)="goBack()">← Back to Admin</button>
      </div>
    </div>

    <div class="container">
      <div class="loading" *ngIf="loading">
        <p>Loading products...</p>
      </div>

      <div class="products-grid" *ngIf="!loading && products.length > 0">
        <div class="product-card" *ngFor="let product of products">
          <div class="product-image">
            <img *ngIf="getProductImageUrl(product)" [src]="getProductImageUrl(product)" [alt]="product.name" />
            <div *ngIf="!getProductImageUrl(product)" class="default-icon">{{getDefaultProductImage(product.category || 'default')}}</div>
          </div>
          <div class="product-info">
            <h3>{{product.name}} <span class="product-id">#{{product.id}}</span></h3>
            <p class="category">{{product.category}}</p>
            <p class="description">{{product.description}}</p>
            <div class="product-details">
              <span class="price">\${{product.price}}</span>
              <span class="quantity">Stock: {{product.quantity}}</span>
            </div>
            <div class="product-actions">
              <button class="edit-btn" (click)="editProduct(product)">Edit</button>
              <button class="delete-btn" (click)="deleteProduct(product)">Delete</button>
            </div>
          </div>
        </div>
      </div>

      <div class="no-products" *ngIf="!loading && products.length === 0">
        <div class="empty-state">
          <div class="empty-icon">📦</div>
          <h3>No Products Found</h3>
          <p>Start by adding your first product to the inventory.</p>
          <button class="add-btn" (click)="addProduct()">Add First Product</button>
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
    
    .header-actions {
      display: flex;
      gap: 15px;
    }
    
    .add-btn, .back-btn {
      background: rgba(255,255,255,0.2);
      border: 1px solid rgba(255,255,255,0.3);
      color: white;
      padding: 10px 20px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.3s ease;
    }
    
    .add-btn:hover, .back-btn:hover {
      background: rgba(255,255,255,0.3);
    }
    
    .container {
      padding: 40px;
      background: #f8f9fa;
      min-height: calc(100vh - 84px);
    }
    
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 25px;
      max-width: 1200px;
      margin: 0 auto;
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
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .product-id {
      font-size: 12px;
      color: #6c757d;
      font-weight: 400;
      background: #f8f9fa;
      padding: 2px 6px;
      border-radius: 4px;
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
    
    .product-details {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }
    
    .price {
      font-size: 20px;
      font-weight: 700;
      color: #27ae60;
    }
    
    .quantity {
      font-size: 14px;
      color: #6c757d;
      font-weight: 600;
    }
    
    .product-actions {
      display: flex;
      gap: 10px;
    }
    
    .edit-btn {
      flex: 1;
      background: #3498db;
      color: white;
      border: none;
      padding: 10px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      transition: all 0.3s ease;
    }
    
    .edit-btn:hover {
      background: #2980b9;
    }
    
    .delete-btn {
      flex: 1;
      background: #e74c3c;
      color: white;
      border: none;
      padding: 10px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      transition: all 0.3s ease;
    }
    
    .delete-btn:hover {
      background: #c0392b;
    }
    
    .loading {
      text-align: center;
      padding: 60px;
      color: #6c757d;
      font-size: 18px;
    }
    
    .no-products {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 400px;
    }
    
    .empty-state {
      text-align: center;
      max-width: 400px;
    }
    
    .empty-icon {
      font-size: 80px;
      margin-bottom: 20px;
    }
    
    .empty-state h3 {
      color: #2c3e50;
      margin-bottom: 10px;
      font-size: 24px;
    }
    
    .empty-state p {
      color: #6c757d;
      margin-bottom: 30px;
      font-size: 16px;
    }
    
    .empty-state .add-btn {
      background: #3498db;
      color: white;
      border: none;
      padding: 15px 30px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
    }
  `]
})
export class ProductManagementComponent implements OnInit {
  products: Product[] = [];
  loading: boolean = true;

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    const currentUser = this.authService.getCurrentUser()?.username || localStorage.getItem('username');
    
    // If superadmin, show all products; if admin, show only their products
    if (this.authService.isSuperAdmin()) {
      this.productService.getAllProducts().subscribe({
        next: (products) => {
          this.products = products || [];
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading products:', error);
          this.loading = false;
          alert('Failed to load products. Please try again.');
        }
      });
    } else {
      this.productService.getProductsByAdmin(currentUser || 'admin').subscribe({
        next: (products) => {
          this.products = products || [];
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading products:', error);
          this.loading = false;
          alert('Failed to load products. Please try again.');
        }
      });
    }
  }

  addProduct(): void {
    this.router.navigate(['/add-product']);
  }

  editProduct(product: Product): void {
    this.router.navigate(['/edit-product', product.id]);
  }

  deleteProduct(product: Product): void {
    if (confirm(`Delete "${product.name}"? This action cannot be undone.`)) {
      console.log('Attempting to delete product:', product);
      this.productService.deleteProduct(product.id!).subscribe({
        next: (response) => {
          console.log('Delete response:', response);
          this.products = this.products.filter(p => p.id !== product.id);
          alert('Product deleted successfully!');
        },
        error: (error) => {
          console.error('Error deleting product:', error);
          console.error('Error status:', error.status);
          console.error('Error message:', error.message);
          if (error.status === 0) {
            alert('Cannot connect to server. Please ensure the product service is running.');
          } else {
            alert(`Failed to delete product: ${error.message}`);
          }
        }
      });
    }
  }

  getDefaultProductImage(category: string | undefined): string {
    return getDefaultProductImage(category || 'default');
  }

  getProductImageUrl(product: Product): string {
    return getProductImageUrl(product);
  }

  goBack(): void {
    this.router.navigate(['/admin']);
  }
}