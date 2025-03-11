import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  emailForm: FormGroup;
  resetForm: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  currentStep = 1; // 1 = email verification, 2 = password reset
  userEmail = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    });
  }

  togglePassword(field: 'password' | 'confirmPassword') {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  verifyEmail() {
    if (this.emailForm.valid) {
      this.userEmail = this.emailForm.value.email;
      
      // Verificar si el email existe antes de continuar
      this.authService.resetPassword(this.userEmail, 'verification_only').subscribe({
        next: () => {
          // Si llegamos aquí, el email existe
          this.currentStep = 2;
        },
        error: (error) => {
          console.error('Email verification failed:', error);
          let errorMessage = 'No se pudo verificar el correo electrónico.';
          
          if (error.status === 404) {
            errorMessage = 'No existe ninguna cuenta con este correo electrónico.';
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          }
          
          alert(errorMessage);
        }
      });
    } else {
      alert('Por favor, introduce un correo electrónico válido.');
    }
  }

  onSubmit() {
    if (this.resetForm.valid) {
      // Check if passwords match
      if (this.resetForm.value.password !== this.resetForm.value.confirmPassword) {
        alert('Las contraseñas no coinciden. Por favor, inténtalo de nuevo.');
        return;
      }
      
      if (this.resetForm.value.password.length < 8) {
        alert('La contraseña debe tener al menos 8 caracteres.');
        return;
      }
      
      // Call the API to reset the password
      this.authService.resetPassword(this.userEmail, this.resetForm.value.password)
        .subscribe({
          next: (response) => {
            console.log('Password reset successful:', response);
            alert('¡Contraseña restablecida con éxito! Ahora puedes iniciar sesión con tu nueva contraseña.');
            this.router.navigate(['/login']);
          },
          error: (error) => {
            console.error('Password reset failed:', error);
            let errorMessage = 'Error al restablecer la contraseña.';
            
            if (error.status === 404) {
              errorMessage = 'No existe ninguna cuenta con este correo electrónico.';
            } else if (error.error?.message) {
              errorMessage = error.error.message;
            }
            
            alert(errorMessage);
          }
        });
    } else {
      alert('Por favor, completa todos los campos correctamente.');
    }
  }
}