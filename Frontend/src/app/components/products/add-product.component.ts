import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="header">
      <h1>Add New Product</h1>
      <button class="back-btn" (click)="goBack()">← Back to Admin</button>
    </div>

    <div class="form-container">
      <form [formGroup]="productForm" (ngSubmit)="onSubmit()" class="product-form">
        <div class="form-field">
          <label>Product Name</label>
          <input type="text" formControlName="name" placeholder="Enter product name" required>
        </div>
        
        <div class="form-field">
          <label>Description</label>
          <textarea formControlName="description" placeholder="Enter product description" rows="4" required></textarea>
        </div>
        
        <div class="form-row">
          <div class="form-field">
            <label>Price ($)</label>
            <input type="number" formControlName="price" placeholder="0.00" step="0.01" required>
          </div>
          
          <div class="form-field">
            <label>Category</label>
            <select formControlName="category" required>
              <option value="">Select Category</option>
              <option value="Electronics">Electronics</option>
              <option value="Food">Food & Beverages</option>
              <option value="Clothing">Clothing</option>
              <option value="Books">Books</option>
              <option value="Home">Home & Garden</option>
              <option value="Sports">Sports</option>
            </select>
          </div>
        </div>
        
        <div class="form-field">
          <label>Image URL (Optional)</label>
          <input type="url" formControlName="imageUrl" placeholder="https://example.com/image.jpg">
        </div>
        
        <div class="form-field">
          <label>Quantity</label>
          <input type="number" formControlName="quantity" placeholder="0" min="0" required>
        </div>
        
        <button type="submit" class="submit-btn" [disabled]="productForm.invalid">
          Add Product
        </button>
      </form>
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
    
    .back-btn:hover {
      background: rgba(255,255,255,0.3);
    }
    
    .form-container {
      padding: 40px;
      background: #f8f9fa;
      min-height: calc(100vh - 84px);
      display: flex;
      justify-content: center;
    }
    
    .product-form {
      background: white;
      padding: 40px;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 600px;
    }
    
    .form-field {
      margin-bottom: 24px;
    }
    
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
    
    .form-field label {
      display: block;
      color: #2c3e50;
      font-weight: 600;
      margin-bottom: 8px;
      font-size: 14px;
    }
    
    .form-field input,
    .form-field textarea,
    .form-field select {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid #e1e8ed;
      border-radius: 8px;
      font-size: 16px;
      transition: border-color 0.3s;
      box-sizing: border-box;
    }
    
    .form-field input:focus,
    .form-field textarea:focus,
    .form-field select:focus {
      outline: none;
      border-color: #667eea;
    }
    
    .submit-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 16px 32px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      width: 100%;
      transition: all 0.3s ease;
    }
    
    .submit-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
    }
    
    .submit-btn:disabled {
      background: #bdc3c7;
      cursor: not-allowed;
      transform: none;
    }
  `]
})
export class AddProductComponent {
  productForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      imageUrl: [''],
      quantity: ['', [Validators.required, Validators.min(0)]]
    });
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const product: Product = {
        ...this.productForm.value,
        adminUsername: localStorage.getItem('username') || 'admin'
      };
      
      console.log('Adding product:', product);
      this.productService.addProduct(product).subscribe({
        next: (response) => {
          console.log('Product added successfully:', response);
          alert('Product added successfully!');
          this.router.navigate(['/admin']);
        },
        error: (error) => {
          console.error('Error adding product:', error);
          console.error('Error details:', error.error);
          if (error.status === 403) {
            alert('Access denied. Please ensure you have admin permissions.');
          } else if (error.status === 0) {
            alert('Cannot connect to server. Please ensure the product service is running.');
          } else {
            alert(`Failed to add product: ${error.message}`);
          }
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/admin']);
  }
}