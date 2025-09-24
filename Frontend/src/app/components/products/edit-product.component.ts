import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="header">
      <h1>Edit Product</h1>
      <button class="back-btn" (click)="goBack()">← Back to Products</button>
    </div>

    <div class="container">
      <div class="form-card" *ngIf="!loading">
        <form [formGroup]="productForm" (ngSubmit)="updateProduct()">
          <div class="form-field">
            <label>Product Name</label>
            <input type="text" formControlName="name" placeholder="Enter product name">
          </div>
          
          <div class="form-field">
            <label>Description</label>
            <textarea formControlName="description" placeholder="Enter product description" rows="3"></textarea>
          </div>
          
          <div class="form-row">
            <div class="form-field">
              <label>Price ($)</label>
              <input type="number" formControlName="price" placeholder="0.00" step="0.01">
            </div>
            
            <div class="form-field">
              <label>Quantity</label>
              <input type="number" formControlName="quantity" placeholder="0">
            </div>
          </div>
          
          <div class="form-field">
            <label>Category</label>
            <select formControlName="category">
              <option value="">Select Category</option>
              <option value="Electronics">Electronics</option>
              <option value="Food">Food</option>
              <option value="Clothing">Clothing</option>
              <option value="Books">Books</option>
              <option value="Home">Home</option>
              <option value="Sports">Sports</option>
            </select>
          </div>
          
          <div class="form-field">
            <label>Image URL (Optional)</label>
            <input type="url" formControlName="imageUrl" placeholder="https://example.com/image.jpg">
          </div>
          
          <div class="form-actions">
            <button type="button" class="cancel-btn" (click)="goBack()">Cancel</button>
            <button type="submit" class="save-btn" [disabled]="productForm.invalid">Update Product</button>
          </div>
        </form>
      </div>
      
      <div class="loading" *ngIf="loading">
        <p>Loading product...</p>
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
      display: flex;
      justify-content: center;
    }
    
    .form-card {
      background: white;
      padding: 40px;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.08);
      width: 100%;
      max-width: 600px;
    }
    
    .form-field {
      margin-bottom: 20px;
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
      border-color: #3498db;
    }
    
    .form-actions {
      display: flex;
      gap: 15px;
      justify-content: flex-end;
      margin-top: 30px;
    }
    
    .cancel-btn, .save-btn {
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .cancel-btn {
      background: #6c757d;
      color: white;
      border: none;
    }
    
    .save-btn {
      background: #27ae60;
      color: white;
      border: none;
    }
    
    .save-btn:disabled {
      background: #bdc3c7;
      cursor: not-allowed;
    }
    
    .loading {
      text-align: center;
      padding: 60px;
      color: #6c757d;
    }
  `]
})
export class EditProductComponent implements OnInit {
  productForm: FormGroup;
  productId: number = 0;
  loading: boolean = true;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      quantity: ['', [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      imageUrl: ['']
    });
  }

  ngOnInit(): void {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadProduct();
  }

  loadProduct(): void {
    console.log('Loading product with ID:', this.productId);
    this.productService.getProductById(this.productId).subscribe({
      next: (product) => {
        console.log('Loaded product data:', product);
        if (product) {
          this.productForm.patchValue({
            name: product.name,
            description: product.description,
            price: product.price,
            quantity: product.quantity,
            category: product.category || '',
            imageUrl: product.imageUrl || ''
          });
          console.log('Form patched with values:', this.productForm.value);
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading product:', error);
        console.error('Error status:', error.status);
        if (error.status === 0) {
          alert('Cannot connect to server. Please ensure the product service is running.');
        } else {
          alert('Failed to load product details.');
        }
        this.goBack();
      }
    });
  }

  updateProduct(): void {
    if (this.productForm.valid) {
      const formValue = this.productForm.value;
      console.log('Form values before update:', formValue);
      
      const updatedProduct: Product = {
        id: this.productId,
        name: formValue.name,
        description: formValue.description,
        price: Number(formValue.price),
        quantity: Number(formValue.quantity),
        category: formValue.category,
        imageUrl: formValue.imageUrl,
        adminUsername: 'admin'
      };

      console.log('Submitting product update:', updatedProduct);
      this.productService.updateProduct(this.productId, updatedProduct).subscribe({
        next: (response) => {
          console.log('Product updated successfully:', response);
          alert('Product updated successfully!');
          // Force reload of product management page
          this.router.navigate(['/product-management']).then(() => {
            window.location.reload();
          });
        },
        error: (error) => {
          console.error('Error updating product:', error);
          console.error('Error details:', error.error);
          if (error.status === 0) {
            alert('Cannot connect to server. Please ensure the product service is running.');
          } else {
            alert(`Failed to update product: ${error.message}`);
          }
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/product-management']);
  }
}