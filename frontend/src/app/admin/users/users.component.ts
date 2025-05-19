import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // Remove RouterLink, keep Router
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { environment } from '../../../environments/environment';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule], // Remove RouterLink
  templateUrl: './users.component.html',
  styleUrls: ['../shared/admin-shared.css', './users.component.css']
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
  // Update the property type to allow string values
  deleteUserId: number | string | null = null;

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
      saldo: [0, [Validators.required, Validators.min(0)]],
      imageUrl: [''] // Añadir campo para la URL de la imagen
    });

    this.balanceForm = this.fb.group({
      amount: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    console.log('UsersComponent initialized');

    // Check authentication status
    const isLoggedIn = this.authService.isLoggedIn();
    console.log('User is logged in:', isLoggedIn);

    // Check admin status
    const isAdmin = this.authService.isAdmin();
    console.log('User is admin:', isAdmin);

    // Get current user
    const currentUser = this.authService.getCurrentUser();
    console.log('Current user:', currentUser);

    this.loadUsers();
  }

  // Update the HTTP requests to use the auth headers
  loadUsers(): void {
    this.isLoading = true;

    console.log('Starting loadUsers method');

    // Check if user is logged in
    if (!this.authService.isLoggedIn()) {
      console.error('User is not logged in');
      this.notificationService.showError('No hay sesión activa. Por favor, inicia sesión nuevamente.');
      this.router.navigate(['/login']);
      this.isLoading = false;
      return;
    }

    // Get current user and log details
    const currentUser = this.authService.getCurrentUser();
    console.log('Current user:', currentUser);

    // Check if user is admin
    const isAdmin = this.authService.isAdmin();
    console.log('Is user admin?', isAdmin);

    if (!isAdmin) {
      console.error('User is not admin');
      this.notificationService.showError('No tienes permisos de administrador para acceder a esta sección.');
      this.router.navigate(['/']);
      this.isLoading = false;
      return;
    }

    // Log the token being used
    const token = this.authService.getToken();
    console.log('Using token (first 10 chars):', token ? token.substring(0, 10) + '...' : 'No token');

    // Continue with the API request
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
    this.selectedUser = user;

    if (user) {
      // Editing existing user
      this.userForm.patchValue({
        nick: user.nick,
        email: user.email,
        tipus_acc: 'Usuario', // Always set to Usuario regardless of current value
        dni: user.dni,
        telefon: user.telefon || '',
        data_naixement: user.data_naixement,
        saldo: user.saldo,
        imageUrl: user.profile_image || '' // Cargar la URL de la imagen existente
      });

      // Actualizar la vista previa de la imagen
      this.imagePreview = user.profile_image || null;

      // Make nick field read-only when editing
      this.userForm.get('nick')?.disable();

      // Password is optional when editing
      this.userForm.get('password')?.setValidators(null);
    } else {
      // Creating new user
      this.userForm.reset({
        tipus_acc: 'Usuario', // Always set to Usuario
        saldo: 0,
        imageUrl: ''
      });

      // Resetear la vista previa
      this.imagePreview = null;

      // Enable nick field for new users
      this.userForm.get('nick')?.enable();

      // Password is required when creating
      this.userForm.get('password')?.setValidators([Validators.required]);
    }

    // Disable the tipus_acc field to prevent changes
    this.userForm.get('tipus_acc')?.disable();

    this.userForm.get('password')?.updateValueAndValidity();
    this.showUserForm = true;
}

  // Add this method to fix the error
  closeUserForm(): void {
    this.showUserForm = false;
    this.userForm.reset();
  }

  // Update submitUserForm to handle disabled fields
  // Fixing Profile Image Storage in the Database

  // I see the issue. The problem is that the backend is expecting a file upload for the profile image, but you're trying to send a URL string. Let's modify the code to handle URL-based images properly.

  // Looking at the Laravel controller, it's expecting a file upload through `$request->hasFile('profile_image')`, but your frontend is sending a URL string in the `profile_image` field.

  // Update your code to handle this situation:
  // Update submitUserForm to properly handle image URLs
  submitUserForm(): void {
    if (this.userForm.invalid) {
      this.notificationService.showError('Por favor, completa todos los campos requeridos correctamente');
      return;
    }

    // Enable disabled fields temporarily to include them in the form value
    if (this.isEditing) {
      this.userForm.get('nick')?.enable();
    }
    this.userForm.get('tipus_acc')?.enable();

    // Get form values
    const userData = { ...this.userForm.value };

    // Asignar la URL de la imagen al campo profile_image
    console.log('Image URL before assignment:', userData.imageUrl);

    // Check if the imageUrl is a valid URL
    if (userData.imageUrl && userData.imageUrl.trim() !== '') {
      userData.profile_image = userData.imageUrl;

      // Add a flag to indicate this is a URL, not a file upload
      userData.is_profile_image_url = true;
    }

    // Eliminar el campo imageUrl ya que no existe en el modelo del servidor
    delete userData.imageUrl;

    console.log('Final user data with profile_image:', userData);

    // Re-disable fields
    if (this.isEditing) {
      this.userForm.get('nick')?.disable();
    }
    this.userForm.get('tipus_acc')?.disable();

    console.log('Submitting user form with data:', userData);

    if (this.isEditing && this.selectedUser) {
      // If password is empty, remove it from the data
      if (!userData.password) {
        delete userData.password;
      }

      this.adminService.updateUser(this.selectedUser.nick, userData).subscribe({
        next: (response) => {
          console.log('User updated successfully:', response);
          this.notificationService.showSuccess('Usuario actualizado correctamente');
          this.closeUserForm();
          this.loadUsers();
        },
        error: (error) => {
          console.error('Error updating user:', error);
          this.notificationService.showError('Error al actualizar el usuario: ' +
            (error.error?.message || error.message || 'Error desconocido'));
        }
      });
    } else {
      // Creating a new user
      this.adminService.createUser(userData).subscribe({
        next: (response) => {
          console.log('User created successfully:', response);
          this.notificationService.showSuccess('Usuario creado correctamente');
          this.closeUserForm();
          this.loadUsers();
        },
        error: (error) => {
          console.error('Error creating user:', error);
          this.notificationService.showError('Error al crear el usuario: ' +
            (error.error?.message || error.message || 'Error desconocido'));
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

  // Update the property type to allow string values

  // Update the confirmDeleteUser method
  confirmDeleteUser(user: any): void {
    console.log('Confirming deletion of user:', user);

    if (!user) {
      console.error('Invalid user object received');
      this.notificationService.showError('Error: Usuario no válido para eliminar');
      return;
    }

    // Store the entire user object
    this.selectedUser = user;

    // Check if the user has an ID property
    if (user.id) {
      this.deleteUserId = user.id;
      console.log('User ID to delete:', this.deleteUserId);
    } else {
      // If no ID is available, use the nick as identifier
      this.deleteUserId = user.nick;
      console.log('Using nick as ID for deletion:', this.deleteUserId);
    }

    if (!this.deleteUserId) {
      console.error('No valid identifier found for user deletion');
      this.notificationService.showError('Error: No se pudo identificar al usuario para eliminar');
      return;
    }

    this.showDeleteConfirm = true;
  }

  // Update the deleteUser method
  deleteUser(): void {
    if (!this.deleteUserId) {
      console.error('No valid user ID for deletion');
      this.notificationService.showError('Error: ID de usuario no válido');
      return;
    }

    console.log('Deleting user with ID/nick:', this.deleteUserId);

    // Show loading notification
    this.notificationService.showInfo('Eliminando usuario y todos sus datos asociados...');

    this.adminService.deleteUser(this.deleteUserId).subscribe({
      next: (response) => {
        console.log('User and all associated data deleted successfully:', response);
        this.notificationService.showSuccess('Usuario y todos sus datos eliminados correctamente');
        this.loadUsers(); // Reload the user list
        this.showDeleteConfirm = false;
        this.deleteUserId = null;
        this.selectedUser = null;
      },
      error: (error) => {
        console.error('Error deleting user:', error);
        let errorMsg = 'Error al eliminar el usuario';

        if (error.message) {
          errorMsg = error.message;
        } else if (error.status === 404) {
          errorMsg = 'Usuario no encontrado';
        } else if (error.status === 500) {
          errorMsg = 'Error interno del servidor al eliminar el usuario y sus datos asociados.';
        } else if (error.error?.message) {
          errorMsg = error.error.message;
        }

        this.notificationService.showError('Error: ' + errorMsg);
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

  // Add this method to the UsersComponent class
  imagePreview: string | null = null;

  onImageUrlChange(): void {
    const imageUrl = this.userForm.get('imageUrl')?.value;
    console.log('Image URL changed to:', imageUrl);

    if (imageUrl && imageUrl.trim() !== '') {
      this.imagePreview = imageUrl;
    } else {
      this.imagePreview = null;
    }
  }

  /**
   * Gets the proper image URL for display
   * Handles both relative paths and full URLs
   */
  getProfileImageUrl(imagePath: string | null): string {
    if (!imagePath) return 'assets/monedapnw.png'; // Change to an existing image

    // Check if the image path already includes http or https
    if (imagePath.startsWith('http')) {
      return imagePath;
    }

    // If it's a relative path, prepend the API base URL
    if (!imagePath.startsWith('assets/')) {
      return `${environment.apiUrl.replace('/api', '')}/${imagePath}`;
    }

    return imagePath;
  }

  /**
   * Handle image loading errors
   */
  handleProfileImageError(event: any): void {
    event.target.src = 'assets/monedapnw.png'; // Change to an existing image
  }

  /**
   * Handle image errors in the preview form
   */
  handleImageError(event: any): void {
    event.target.src = 'assets/monedapnw.png'; // Change to an existing image
  }

  // Make sure you have the getUserInitials method
  getUserInitials(name: string): string {
    if (!name) return '';

    const names = name.split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    } else {
      return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
    }
  }
}
