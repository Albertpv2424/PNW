import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
// Remove NotificationComponent import

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink], // Remove NotificationComponent
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  emailForm: FormGroup;
  resetForm: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  currentStep = 1; // 1 = email form, 2 = email sent confirmation, 3 = password reset
  userEmail = '';
  token = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Check if we have a token in the URL (from email link)
    this.route.queryParams.subscribe(params => {
      if (params['token'] && params['email']) {
        this.token = params['token'];
        this.userEmail = params['email'];
        this.currentStep = 3; // Go directly to password reset form
      }
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

      // Request password reset email
      this.authService.requestPasswordReset(this.userEmail).subscribe({
        next: (response) => {
          console.log('Password reset email sent:', response);
          this.notificationService.showSuccess('Se ha enviado un correo electrónico con instrucciones para restablecer tu contraseña.');
          this.currentStep = 2; // Show email sent confirmation
        },
        error: (error) => {
          console.error('Password reset email request failed:', error);
          let errorMessage = 'No se pudo enviar el correo electrónico.';

          if (error.status === 404) {
            errorMessage = 'No existe ninguna cuenta con este correo electrónico.';
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          }

          this.notificationService.showError(errorMessage);
        }
      });
    } else {
      this.notificationService.showError('Por favor, introduce un correo electrónico válido.');
    }
  }

  onSubmit() {
    if (this.resetForm.valid) {
      // Check if passwords match
      if (this.resetForm.value.password !== this.resetForm.value.confirmPassword) {
        this.notificationService.showError('Las contraseñas no coinciden. Por favor, inténtalo de nuevo.');
        return;
      }

      if (this.resetForm.value.password.length < 8) {
        this.notificationService.showError('La contraseña debe tener al menos 8 caracteres.');
        return;
      }

      // Call the API to reset the password with token
      this.authService.resetPasswordWithToken(
        this.userEmail,
        this.resetForm.value.password,
        this.token
      ).subscribe({
        next: (response) => {
          console.log('Password reset successful:', response);
          this.notificationService.showSuccess('¡Contraseña restablecida con éxito! Ahora puedes iniciar sesión con tu nueva contraseña.');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error) => {
          console.error('Password reset failed:', error);
          let errorMessage = 'Error al restablecer la contraseña.';

          if (error.status === 404) {
            errorMessage = 'No existe ninguna cuenta con este correo electrónico.';
          } else if (error.status === 401) {
            errorMessage = 'El enlace de restablecimiento ha expirado o no es válido.';
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          }

          this.notificationService.showError(errorMessage);
        }
      });
    } else {
      this.notificationService.showError('Por favor, completa todos los campos correctamente.');
    }
  }
}