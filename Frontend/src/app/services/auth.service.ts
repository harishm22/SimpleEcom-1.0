import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { LoginRequest, LoginResponse, RegisterRequest } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8081/api/auth';
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    if (token) {
      const user = this.parseToken(token);
      this.currentUserSubject.next(user);
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    console.log('Attempting login with:', credentials);
    
    // Try backend login first, then fallback to local
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          console.log('Backend login response:', response);
          localStorage.setItem('token', response.token);
          localStorage.setItem('username', response.username);
          localStorage.setItem('roles', JSON.stringify(response.roles));
          this.currentUserSubject.next(response);
          
          // Add user to localStorage for user management
          this.addUserToLocalStorage(response);
        }),
        // If backend fails, try local authentication
        catchError(error => {
          console.log('Backend login failed, trying local auth:', error);
          return this.loginLocally(credentials);
        })
      );
  }
  
  private loginLocally(credentials: LoginRequest): Observable<LoginResponse> {
    return new Observable<LoginResponse>(observer => {
      try {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find((u: any) => 
          u.username === credentials.username && u.enabled
        );
        
        if (!user) {
          observer.error({ error: { message: 'Invalid credentials or account not approved' } });
          return;
        }
        
        // Create mock token and response
        const mockToken = btoa(JSON.stringify({
          sub: user.username,
          roles: user.roles.map((role: string) => ({ authority: `ROLE_${role}` }))
        }));
        
        const response: LoginResponse = {
          token: mockToken,
          username: user.username,
          roles: user.roles.map((role: string) => ({ authority: `ROLE_${role}` }))
        };
        
        localStorage.setItem('token', response.token);
        localStorage.setItem('username', response.username);
        localStorage.setItem('roles', JSON.stringify(response.roles));
        this.currentUserSubject.next(response);
        
        console.log('Local login successful:', response);
        observer.next(response);
        observer.complete();
        
      } catch (error) {
        observer.error({ error: { message: 'Login failed' } });
      }
    });
  }
  
  private addUserToLocalStorage(loginResponse: LoginResponse): void {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const existingUser = users.find((u: any) => u.username === loginResponse.username);
    
    if (!existingUser) {
      const newUser = {
        id: Date.now(),
        username: loginResponse.username,
        email: `${loginResponse.username}@example.com`, // Default email
        roles: loginResponse.roles.map(r => r.authority.replace('ROLE_', '')),
        enabled: true
      };
      
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      console.log('Added backend user to localStorage:', newUser);
    }
  }

  register(userData: RegisterRequest): Observable<any> {
    console.log('Attempting registration with:', userData);
    
    // For demo purposes, handle registration locally
    return new Observable(observer => {
      try {
        // Get existing users from localStorage
        const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Check if username already exists
        if (existingUsers.some((user: any) => user.username === userData.username)) {
          observer.error({ error: 'Username already exists' });
          return;
        }
        
        // Create new user
        const newUser = {
          id: Date.now(), // Simple ID generation
          username: userData.username,
          email: userData.email,
          roles: userData.roles,
          enabled: userData.roles && userData.roles.includes('ADMIN') ? false : true // Admin needs approval
        };
        
        // Add to users list
        existingUsers.push(newUser);
        localStorage.setItem('users', JSON.stringify(existingUsers));
        
        console.log('User registered locally:', newUser);
        observer.next({ message: 'Registration successful' });
        observer.complete();
        
      } catch (error) {
        observer.error({ error: 'Registration failed' });
      }
    });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('roles');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }

  hasRole(role: string): boolean {
    const roles = JSON.parse(localStorage.getItem('roles') || '[]');
    return roles.some((r: any) => r.authority === role || r.authority === `ROLE_${role}`);
  }

  isAdmin(): boolean {
    return this.hasRole('ADMIN') || this.hasRole('SUPERADMIN');
  }

  isSuperAdmin(): boolean {
    return this.hasRole('SUPERADMIN');
  }

  private parseToken(token: string): any {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        username: payload.sub,
        roles: payload.roles || []
      };
    } catch (error) {
      return null;
    }
  }
}