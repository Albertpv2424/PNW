import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { environment } from '../../../environments/environment';
import { AdminService } from '../../services/admin.service';

// Actualiza la línea de styleUrls para eliminar la referencia a admin-dashboard.css
@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  selectedUser: any = null;
  isLoading: boolean = true;
  searchTerm: string = '';
  showUserForm: boolean = false;
  userForm: FormGroup;
  isEditing: boolean = false;
  showBalanceForm: boolean = false;
  balanceForm: FormGroup;
  showDeleteConfirm: boolean = false;
  deleteUserId: number | null = null;
  
  constructor(
    private http: HttpClient,
    // Change from private to public
    public authService: AuthService,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    private adminService: AdminService,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      nick: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      tipus_acc: ['Usuario', [Validators.required]],
      dni: ['', [Validators.required]],
      telefon: [''],
      data_naixement: ['', [Validators.required]],
      saldo: [0, [Validators.required, Validators.min(0)]]
    });
    
    this.balanceForm = this.fb.group({
      amount: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  // Update the HTTP requests to use the auth headers
  loadUsers(): void {
    this.isLoading = true;
    
    if (!this.authService.isLoggedIn()) {
      this.notificationService.showError('No hay sesión activa. Por favor, inicia sesión nuevamente.');
      this.isLoading = false;
      return;
    }
    
    if (!this.authService.isAdmin()) {
      this.notificationService.showError('No tienes permisos de administrador para acceder a esta sección.');
      this.isLoading = false;
      return;
    }
    
    this.http.get(`${environment.apiUrl}/admin/users`, {
      headers: this.authService.getAuthHeaders()
    }).subscribe({
      next: (data: any) => {
        // More robust filtering to handle case sensitivity and different admin types
        this.users = data.filter((user: any) => {
          const userType = user.tipus_acc?.toLowerCase() || '';
          return userType !== 'admin' && userType !== 'administrador';
        });
        this.filteredUsers = [...this.users];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        
        if (error.status === 403) {
          this.notificationService.showError('No tienes permisos de administrador para acceder a esta sección.');
        } else if (error.status === 401) {
          this.notificationService.showError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        } else {
          this.notificationService.showError('Error al cargar los usuarios: ' + (error.error?.message || 'Error desconocido'));
        }
        
        this.isLoading = false;
      }
    });
  }

  searchUsers(): void {
    if (!this.searchTerm.trim()) {
      this.filteredUsers = [...this.users];
      return;
    }
    
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredUsers = this.users.filter(user => 
      user.nick.toLowerCase().includes(term) || 
      user.email.toLowerCase().includes(term) ||
      user.dni?.toLowerCase().includes(term)
    );
  }

  selectUser(user: any): void {
    this.selectedUser = user;
  }

  openUserForm(user: any = null): void {
    this.isEditing = !!user;
    
    if (user) {
      // Editing existing user
      this.userForm.patchValue({
        nick: user.nick,
        email: user.email,
        tipus_acc: 'Usuario', // Always set to Usuario regardless of current value
        dni: user.dni,
        telefon: user.telefon || '',
        data_naixement: user.data_naixement,
        saldo: user.saldo
      });
      // Password is optional when editing
      this.userForm.get('password')?.setValidators(null);
    } else {
      // Creating new user
      this.userForm.reset({
        tipus_acc: 'Usuario', // Always set to Usuario
        saldo: 0
      });
      // Password is required when creating
      this.userForm.get('password')?.setValidators([Validators.required]);
    }
    
    // Disable the tipus_acc field to prevent changes
    this.userForm.get('tipus_acc')?.disable();
    
    this.userForm.get('password')?.updateValueAndValidity();
    this.showUserForm = true;
  }

  closeUserForm(): void {
    this.showUserForm = false;
    this.userForm.reset();
  }

  submitUserForm(): void {
    if (this.userForm.invalid) {
      this.notificationService.showError('Por favor, completa todos los campos requeridos correctamente');
      return;
    }
    
    const userData = this.userForm.value;
    
    if (this.isEditing && this.selectedUser) {
      // If password is empty, remove it from the data
      if (!userData.password) {
        delete userData.password;
      }
      
      this.http.put(`${environment.apiUrl}/admin/users/${this.selectedUser.id}`, userData, {
        headers: this.authService.getAuthHeaders()
      }).subscribe({
        next: (response) => {
          this.notificationService.showSuccess('Usuario actualizado correctamente');
          this.loadUsers();
          this.closeUserForm();
        },
        error: (error) => {
          console.error('Error updating user:', error);
          this.notificationService.showError('Error al actualizar el usuario');
        }
      });
    } else {
      this.http.post(`${environment.apiUrl}/admin/users`, userData, {
        headers: this.authService.getAuthHeaders()
      }).subscribe({
        next: (response) => {
          this.notificationService.showSuccess('Usuario creado correctamente');
          this.loadUsers();
          this.closeUserForm();
        },
        error: (error) => {
          console.error('Error creating user:', error);
          this.notificationService.showError('Error al crear el usuario');
        }
      });
    }
  }

  openBalanceForm(user: any): void {
    this.selectedUser = user;
    this.balanceForm.patchValue({
      amount: user.saldo
    });
    this.showBalanceForm = true;
  }

  submitBalanceForm(): void {
    if (this.balanceForm.invalid || !this.selectedUser) {
      this.notificationService.showError('Por favor, ingresa un monto válido');
      return;
    }
    
    const amount = this.balanceForm.value.amount;
    
    // Use nick as the ID since that's the primary key in the User model
    if (!this.selectedUser.nick) {
      console.error('User ID is undefined', this.selectedUser);
      this.notificationService.showError('Error: ID de usuario no válido');
      return;
    }
    
    console.log('Updating balance for user:', this.selectedUser.nick, 'Amount:', amount);
    
    // Now this will work correctly
    this.adminService.updateUserBalance(this.selectedUser.nick, amount).subscribe({
      next: (response: any) => {
        this.notificationService.showSuccess(`Saldo actualizado correctamente a ${response.saldo}`);
        this.loadUsers();
        this.closeBalanceForm();
      },
      error: (error) => {
        console.error('Error updating balance:', error);
        this.notificationService.showError('Error al actualizar el saldo');
      }
    });
  }

  closeBalanceForm(): void {
    this.showBalanceForm = false;
    this.balanceForm.reset();
  }

  // We can either remove this method entirely or modify it to prevent role changes
  // Option 1: Remove the method entirely if it's not used elsewhere
  
  // Option 2: Modify it to prevent role changes
  changeUserRole(user: any, role: string): void {
    // Prevent role changes
    this.notificationService.showError('No está permitido cambiar el rol de los usuarios');
    return;
  }

  confirmDeleteUser(userId: number | null): void {
    this.deleteUserId = userId;
    this.showDeleteConfirm = true;
  }

  deleteUser(): void {
    if (!this.deleteUserId) {
      this.notificationService.showError('Error: ID de usuario no válido');
      return;
    }
    
    console.log('Deleting user ID:', this.deleteUserId);
    
    // Now this will work correctly
    this.adminService.deleteUser(this.deleteUserId).subscribe({
      next: () => {
        this.notificationService.showSuccess('Usuario eliminado correctamente');
        this.loadUsers();
        this.showDeleteConfirm = false;
        this.deleteUserId = null;
      },
      error: (error) => {
        console.error('Error deleting user:', error);
        this.notificationService.showError('Error al eliminar el usuario');
      }
    });
  }

  // Add this missing method
  cancelDeleteUser(): void {
    this.showDeleteConfirm = false;
    this.deleteUserId = null;
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }

  // Add this method to your component class
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Añadir este método para obtener las iniciales del usuario
  getUserInitials(username: string): string {
    if (!username) return '';
  
    const names = username.split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    } else {
      return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
    }
  }
}
