import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
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
    private authService: AuthService
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
          this.loginStatus = { type: 'success', message: '¡Login exitoso! Redirigiendo...' };
          
          // Check if response and user exist before accessing properties
          if (response && response.user && response.user.nick) {
            alert('¡Login exitoso! Bienvenido ' + response.user.nick);
          } else {
            alert('¡Login exitoso!');
          }
          
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 1500);
        },
        error: (error) => {
          console.error('Login failed', error);
          let errorMessage = 'Error al iniciar sesión.';
          
          if (error.status === 401 || error.status === 422) {
            errorMessage = 'Credenciales incorrectas. Por favor, verifica tu usuario y contraseña.';
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          } else {
            errorMessage = 'Error al iniciar sesión. Por favor, verifica tus credenciales.';
          }
          
          this.loginStatus = { 
            type: 'error', 
            message: errorMessage
          };
          
          alert(errorMessage);
        }
      });
    } else {
      console.log('Form is invalid');
      this.loginStatus = { 
        type: 'error', 
        message: 'Por favor, completa todos los campos correctamente.' 
      };
      
      alert('Por favor, completa todos los campos correctamente.');
    }
  }
}