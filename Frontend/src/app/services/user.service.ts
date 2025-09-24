import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id: number;
  username: string;
  email: string;
  roles: string[];
  enabled: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8081/api/user';

  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    // Get users from localStorage for demo
    const users = this.getUsersFromStorage();
    return new Observable(observer => {
      observer.next(users);
      observer.complete();
    });
  }

  toggleUser(id: number): Observable<any> {
    return new Observable(observer => {
      const users = this.getUsersFromStorage();
      const user = users.find(u => u.id === id);
      if (user) {
        user.enabled = !user.enabled;
        this.saveUsersToStorage(users);
        observer.next({ success: true });
      } else {
        observer.error({ message: 'User not found' });
      }
      observer.complete();
    });
  }

  deleteUser(id: number): Observable<any> {
    return new Observable(observer => {
      const users = this.getUsersFromStorage();
      const filteredUsers = users.filter(u => u.id !== id);
      this.saveUsersToStorage(filteredUsers);
      observer.next({ success: true });
      observer.complete();
    });
  }

  private getUsersFromStorage(): User[] {
    const stored = localStorage.getItem('users');
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Default users if none exist
    const defaultUsers: User[] = [
      { id: 1, username: 'superadmin', email: 'superadmin@example.com', roles: ['SUPERADMIN'], enabled: true },
      { id: 2, username: 'admin', email: 'admin@example.com', roles: ['ADMIN'], enabled: true },
      { id: 3, username: 'user', email: 'user@example.com', roles: ['USER'], enabled: true },
      { id: 4, username: 'testuser', email: 'test@example.com', roles: ['USER'], enabled: true },
      { id: 5, username: 'pendingadmin', email: 'pending@example.com', roles: ['ADMIN'], enabled: false }
    ];
    
    this.saveUsersToStorage(defaultUsers);
    return defaultUsers;
  }

  private saveUsersToStorage(users: User[]): void {
    localStorage.setItem('users', JSON.stringify(users));
  }
}