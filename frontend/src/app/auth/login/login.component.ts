import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { NotificationComponent } from '../../auth/notification/notification.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, NotificationComponent], // Add NotificationComponent
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword = false;
  loginStatus: { type: 'success' | 'error'; message: string } | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService // Add this
  ) {
    this.loginForm = this.fb.group({
      // Change from email validator to just required
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      remember: [false]
    });
  }

  handleImageError(event: any) {
    console.error('Error loading image:', event);
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    console.log('Submit button clicked');
    
    if (this.loginForm.valid) {
      console.log('Form is valid', this.loginForm.value);
      this.loginStatus = { type: 'success', message: 'Intentando iniciar sesión...' };
      
      const credentials = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      };

      this.authService.login(credentials).subscribe({
        next: (response) => {
          console.log('Login successful!', response);
          
          // Verificar y mostrar el tipo de cuenta para depuración
          if (response && response.user) {
            console.log('Tipo de cuenta:', response.user.tipus_acc);
          }
          
          this.loginStatus = { type: 'success', message: '¡Login exitoso! Redirigiendo...' };
          
          // Check if response and user exist before accessing properties
          if (response && response.user && response.user.nick) {
            this.notificationService.showSuccess('¡Login exitoso! Bienvenido ' + response.user.nick);
          } else {
            this.notificationService.showSuccess('¡Login exitoso!');
          }
          
          // Redirección inmediata basada en el tipo de usuario
          const userType = response?.user?.tipus_acc?.toString().trim() || '';
          const isAdmin = ['admin', 'Admin', 'administrador', 'Administrador'].includes(userType);
          
          if (isAdmin) {
            console.log('Admin user detected, redirecting to admin dashboard immediately');
            this.router.navigate(['/admin/dashboard']);
          } else {
            console.log('Regular user detected, redirecting to home');
            this.router.navigate(['/']);
          }
        },
        error: (error) => {
          console.error('Login failed', error);
          this.loginStatus = { 
            type: 'error', 
            message: error.error?.message || 'Error al iniciar sesión. Por favor, verifica tus credenciales.'
          };
          
          this.notificationService.showError(this.loginStatus.message);
        }
      });
    } else {
      console.log('Form is invalid');
      this.loginStatus = { 
        type: 'error', 
        message: 'Por favor, completa todos los campos correctamente.' 
      };
      
      this.notificationService.showError(this.loginStatus.message);
    }
  }
}