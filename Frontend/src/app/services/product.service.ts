import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:8082/api/products';

  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl).pipe(
      catchError(error => {
        console.log('Backend unavailable, using localStorage');
        return of(this.getProductsFromStorage());
      }),
      // Apply stock reductions from localStorage
      map(products => this.applyStockReductions(products))
    );
  }

  getProductsByAdmin(adminUsername: string): Observable<Product[]> {
    return this.getAllProducts().pipe(
      map(products => products.filter(product => 
        product.adminUsername === adminUsername
      ))
    );
  }

  getProductById(id: number): Observable<Product> {
    console.log('Getting product by ID:', id);
    return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.log('Backend unavailable, using localStorage');
        const products = this.getProductsFromStorage();
        const product = products.find(p => p.id === id);
        return of(product || this.createEmptyProduct());
      })
    );
  }

  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.log('Backend unavailable, saving to localStorage');
        return of(this.addProductToStorage(product));
      })
    );
  }

  updateProduct(id: number, product: Product): Observable<Product> {
    console.log('Updating product:', id, product);
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.log('Backend unavailable, updating localStorage');
        return of(this.updateProductInStorage(id, product));
      })
    );
  }

  deleteProduct(id: number): Observable<any> {
    console.log('Deleting product with ID:', id);
    return this.http.delete(`${this.apiUrl}/${id}`, { 
      headers: this.getHeaders(),
      responseType: 'text' 
    }).pipe(
      catchError(error => {
        console.log('Backend unavailable, deleting from localStorage');
        this.deleteProductFromStorage(id);
        return of('Product deleted successfully');
      })
    );
  }

  private getProductsFromStorage(): Product[] {
    const stored = localStorage.getItem('products');
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Default products if none exist
    const defaultProducts: Product[] = [
      {
        id: 1,
        name: 'Laptop',
        description: 'High-performance laptop for work and gaming',
        price: 999.99,
        category: 'Electronics',
        imageUrl: 'https://via.placeholder.com/300x200/3498db/ffffff?text=Laptop',
        quantity: 10
      },
      {
        id: 2,
        name: 'Smartphone',
        description: 'Latest smartphone with advanced features',
        price: 699.99,
        category: 'Electronics',
        imageUrl: 'https://via.placeholder.com/300x200/e74c3c/ffffff?text=Phone',
        quantity: 15
      },
      {
        id: 3,
        name: 'T-Shirt',
        description: 'Comfortable cotton t-shirt',
        price: 29.99,
        category: 'Clothing',
        imageUrl: 'https://via.placeholder.com/300x200/27ae60/ffffff?text=T-Shirt',
        quantity: 25
      }
    ];
    
    this.saveProductsToStorage(defaultProducts);
    return defaultProducts;
  }

  private addProductToStorage(product: Product): Product {
    const products = this.getProductsFromStorage();
    const newProduct = {
      ...product,
      id: Date.now() // Generate unique ID
    };
    products.push(newProduct);
    this.saveProductsToStorage(products);
    return newProduct;
  }

  private updateProductInStorage(id: number, product: Product): Product {
    const products = this.getProductsFromStorage();
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
      products[index] = { ...product, id };
      this.saveProductsToStorage(products);
      return products[index];
    }
    return product;
  }

  private deleteProductFromStorage(id: number): void {
    const products = this.getProductsFromStorage();
    const filteredProducts = products.filter(p => p.id !== id);
    this.saveProductsToStorage(filteredProducts);
  }

  private saveProductsToStorage(products: Product[]): void {
    localStorage.setItem('products', JSON.stringify(products));
  }

  private applyStockReductions(products: Product[]): Product[] {
    const stockReductions = JSON.parse(localStorage.getItem('stockReductions') || '{}');
    
    return products.map(product => {
      const reduction = stockReductions[product.id!] || 0;
      const adjustedQuantity = Math.max(0, (product.quantity || 0) - reduction);
      
      if (reduction > 0) {
        console.log(`Applying stock reduction to ${product.name}: ${product.quantity} - ${reduction} = ${adjustedQuantity}`);
      }
      
      return {
        ...product,
        quantity: adjustedQuantity
      };
    });
  }

  private createEmptyProduct(): Product {
    return {
      id: 0,
      name: 'Product Not Found',
      description: 'This product could not be found',
      price: 0,
      category: 'Unknown',
      imageUrl: 'https://via.placeholder.com/300x200/95a5a6/ffffff?text=Not+Found',
      quantity: 0
    };
  }
}