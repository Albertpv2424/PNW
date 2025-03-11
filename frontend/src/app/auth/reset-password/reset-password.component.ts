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
      // Here you would typically call an API to verify the email exists
      // and send a verification code or token
      
      // For now, we'll just move to step 2
      this.currentStep = 2;
    }
  }

  onSubmit() {
    if (this.resetForm.valid) {
      // Check if passwords match
      if (this.resetForm.value.password !== this.resetForm.value.confirmPassword) {
        // Handle password mismatch
        console.error('Las contraseñas no coinciden');
        alert('Las contraseñas no coinciden');
        return;
      }
      
      // Call the API to reset the password
      this.authService.resetPassword(this.userEmail, this.resetForm.value.password)
        .subscribe({
          next: (response) => {
            console.log('Password reset successful:', response);
            alert('Contraseña restablecida con éxito. Ahora puedes iniciar sesión con tu nueva contraseña.');
            this.router.navigate(['/login']);
          },
          error: (error) => {
            console.error('Password reset failed:', error);
            alert('Error al restablecer la contraseña: ' + 
              (error.error?.message || 'Por favor, inténtalo de nuevo más tarde.'));
          }
        });
    }
  }
}