import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService, User } from '../../services/user.service';



@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="header">
      <h1>User Management</h1>
      <button class="back-btn" (click)="goBack()">← Back to Admin</button>
    </div>

    <div class="container">
      <div class="section">
        <h2>Pending Admin Approvals</h2>
        <div class="user-list" *ngIf="pendingAdmins.length > 0">
          <div class="user-card pending" *ngFor="let user of pendingAdmins">
            <div class="user-info">
              <h3>{{user.username}}</h3>
              <p>{{user.email}}</p>
              <span class="role-badge admin">Admin Request</span>
            </div>
            <div class="actions">
              <button class="approve-btn" (click)="approveAdmin(user)">Approve</button>
              <button class="reject-btn" (click)="rejectAdmin(user)">Reject</button>
            </div>
          </div>
        </div>
        <p *ngIf="pendingAdmins.length === 0" class="no-data">No pending admin requests</p>
      </div>

      <div class="section">
        <div class="section-header">
          <h2>User Management</h2>
          <div class="user-stats">
            <span class="stat-item">Total: {{allUsers.length}}</span>
            <span class="stat-item">Active: {{getActiveUsersCount()}}</span>
          </div>
        </div>
        
        <div class="users-table">
          <div class="table-header">
            <div class="col-user">User</div>
            <div class="col-role">Role & Status</div>
            <div class="col-specializations">Specializations</div>
            <div class="col-actions">Actions</div>
          </div>
          
          <div class="table-row" *ngFor="let user of allUsers" [class.superadmin-row]="user.roles.includes('SUPERADMIN')">
            <div class="col-user">
              <div class="user-avatar">{{user.username.charAt(0).toUpperCase()}}</div>
              <div class="user-details">
                <h4>{{user.username}}</h4>
                <span class="user-email">{{user.email}}</span>
              </div>
            </div>
            
            <div class="col-role">
              <span class="role-badge" [class]="user.roles[0].toLowerCase()">{{user.roles.join(', ')}}</span>
              <span class="status-indicator" [class.active]="user.enabled" [class.inactive]="!user.enabled">
                {{user.enabled ? 'Active' : 'Inactive'}}
              </span>
            </div>
            
            <div class="col-specializations">
              <div class="specializations-container" *ngIf="getUserSpecializations(user.username).length > 0">
                <span class="spec-chip" *ngFor="let spec of getUserSpecializations(user.username)">
                  {{spec}}
                </span>
              </div>
              <span class="no-specs" *ngIf="getUserSpecializations(user.username).length === 0 && user.roles.includes('ADMIN')">
                Not specified
              </span>
            </div>
            
            <div class="col-actions">
              <div class="action-buttons" *ngIf="!user.roles.includes('SUPERADMIN')">
                <button class="btn-toggle" [class.enable]="!user.enabled" [class.disable]="user.enabled" (click)="toggleUser(user)">
                  {{user.enabled ? 'Disable' : 'Enable'}}
                </button>
                <button class="btn-delete" (click)="deleteUser(user)">Delete</button>
              </div>
              <span class="protected" *ngIf="user.roles.includes('SUPERADMIN')">Protected</span>
            </div>
          </div>
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
    
    .container {
      padding: 40px;
      background: #f8f9fa;
      min-height: calc(100vh - 84px);
    }
    
    .section {
      background: white;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 24px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    }
    
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    
    .section h2 {
      color: #2c3e50;
      margin: 0;
      font-size: 22px;
      font-weight: 600;
    }
    
    .user-stats {
      display: flex;
      gap: 20px;
    }
    
    .stat-item {
      background: #f8f9fa;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 500;
      color: #495057;
    }
    
    .users-table {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    }
    
    .table-header {
      display: grid;
      grid-template-columns: 2fr 1.5fr 2fr 1fr;
      gap: 20px;
      padding: 16px 20px;
      background: #f8f9fa;
      font-weight: 600;
      color: #495057;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .table-row {
      display: grid;
      grid-template-columns: 2fr 1.5fr 2fr 1fr;
      gap: 20px;
      padding: 20px;
      border-bottom: 1px solid #f1f3f4;
      transition: background 0.2s;
    }
    
    .table-row:hover {
      background: #f8f9fa;
    }
    
    .table-row.superadmin-row {
      background: linear-gradient(90deg, #fff5f5, #ffffff);
      border-left: 4px solid #e74c3c;
    }
    
    .col-user {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea, #764ba2);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 600;
      font-size: 16px;
    }
    
    .user-details h4 {
      margin: 0 0 4px 0;
      color: #2c3e50;
      font-size: 16px;
      font-weight: 600;
    }
    
    .user-email {
      color: #6c757d;
      font-size: 13px;
    }
    
    .col-role {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .status-indicator {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
      text-align: center;
    }
    
    .status-indicator.active {
      background: #d4edda;
      color: #155724;
    }
    
    .status-indicator.inactive {
      background: #f8d7da;
      color: #721c24;
    }
    
    .specializations-container {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    
    .spec-chip {
      background: #e3f2fd;
      color: #1565c0;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 500;
      border: 1px solid #bbdefb;
    }
    
    .no-specs {
      color: #9e9e9e;
      font-size: 12px;
      font-style: italic;
    }
    
    .action-buttons {
      display: flex;
      gap: 8px;
    }
    
    .btn-toggle, .btn-delete {
      padding: 6px 12px;
      border: none;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .btn-toggle.enable {
      background: #d4edda;
      color: #155724;
    }
    
    .btn-toggle.disable {
      background: #fff3cd;
      color: #856404;
    }
    
    .btn-delete {
      background: #f8d7da;
      color: #721c24;
    }
    
    .btn-toggle:hover, .btn-delete:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .protected {
      color: #6c757d;
      font-size: 12px;
      font-style: italic;
    }
    
    .role-badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      margin-right: 8px;
    }
    
    .role-badge.user {
      background: #3498db;
      color: white;
    }
    
    .role-badge.admin {
      background: #e74c3c;
      color: white;
    }
    
    .role-badge.superadmin {
      background: #9b59b6;
      color: white;
    }
    

    
    .status {
      font-size: 12px;
      color: #27ae60;
      font-weight: 600;
    }
    
    .status.disabled {
      color: #e74c3c;
    }
    

    
    .no-data {
      color: #6c757d;
      font-style: italic;
      text-align: center;
      padding: 20px;
    }
  `]
})
export class UserManagementComponent implements OnInit {
  pendingAdmins: User[] = [];
  allUsers: User[] = [];

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.allUsers = users;
        this.pendingAdmins = users.filter(user => 
          user.roles.includes('ADMIN') && !user.enabled
        );
        console.log('Loaded users:', users);
      },
      error: (error) => {
        console.error('Error loading users:', error);
        alert('Failed to load users. Please check if you have SuperAdmin permissions.');
      }
    });
  }

  approveAdmin(user: User): void {
    if (confirm(`Approve ${user.username} as Admin?`)) {
      this.userService.toggleUser(user.id).subscribe({
        next: () => {
          alert(`${user.username} approved as Admin!`);
          this.loadUsers(); // Reload to refresh the lists
        },
        error: (error) => {
          console.error('Error approving admin:', error);
          alert('Failed to approve admin.');
        }
      });
    }
  }

  rejectAdmin(user: User): void {
    if (confirm(`Reject ${user.username}'s admin request?`)) {
      this.userService.deleteUser(user.id).subscribe({
        next: () => {
          alert(`${user.username}'s admin request rejected!`);
          this.loadUsers(); // Reload to refresh the lists
        },
        error: (error) => {
          console.error('Error rejecting admin:', error);
          alert('Failed to reject admin request.');
        }
      });
    }
  }

  toggleUser(user: User): void {
    const action = user.enabled ? 'disable' : 'enable';
    if (confirm(`${action} ${user.username}?`)) {
      this.userService.toggleUser(user.id).subscribe({
        next: () => {
          user.enabled = !user.enabled;
          alert(`${user.username} ${action}d successfully!`);
        },
        error: (error) => {
          console.error('Error toggling user:', error);
          alert('Failed to update user status.');
        }
      });
    }
  }

  deleteUser(user: User): void {
    if (confirm(`Delete ${user.username}? This action cannot be undone.`)) {
      this.userService.deleteUser(user.id).subscribe({
        next: () => {
          this.allUsers = this.allUsers.filter(u => u.id !== user.id);
          alert(`${user.username} deleted successfully!`);
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          alert('Failed to delete user.');
        }
      });
    }
  }

  getUserSpecializations(username: string): string[] {
    const specializations = localStorage.getItem(`user_${username}_specializations`);
    return specializations ? JSON.parse(specializations) : [];
  }

  getActiveUsersCount(): number {
    return this.allUsers.filter(u => u.enabled).length;
  }

  goBack(): void {
    this.router.navigate(['/admin']);
  }
}