import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageSliderComponent } from '../../language-slider/language-slider.component';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    TranslateModule,
    LanguageSliderComponent
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  showPassword = false;
  logoPath: string = '/assets/logo.jpg';
  imagePreview: SafeUrl | null = null;
  selectedImage: File | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService,
    private sanitizer: DomSanitizer
  ) {
    // Change from formBuilder to fb (the property name you defined in constructor)
    this.registerForm = this.fb.group({
      nick: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      pswd: ['', Validators.required],
      dni: ['', [Validators.required, Validators.pattern('^[0-9]{8}[A-Z]$')]],
      telefon: ['', Validators.pattern('^[0-9]{9,15}$')],
      data_naixement: ['', [Validators.required, this.ageValidator]],
      profile_image: [''], // This will be handled separately
      profileImageUrl: [''], // Nuevo campo para URL de imagen
      terms: [false, Validators.requiredTrue]
    });
  }

  ngOnInit(): void {
    // No initialization needed
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  // Add this method to handle image selection
  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        this.notificationService.showError('La imagen no debe superar los 2MB');
        return;
      }

      // Check file type
      if (!file.type.match(/image\/(jpeg|jpg|png|gif)$/)) {
        this.notificationService.showError('Solo se permiten imágenes (JPEG, PNG, GIF)');
        return;
      }

      this.selectedImage = file;

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = this.sanitizer.bypassSecurityTrustUrl(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Clear URL input when file is selected
      this.registerForm.patchValue({
        profileImageUrl: ''
      });
    }
  }

  // Nuevo método para manejar la entrada de URL de imagen
  onImageUrlInput() {
    const url = this.registerForm.get('profileImageUrl')?.value;
    if (url && url.trim() !== '') {
      // Crear vista previa desde URL
      this.imagePreview = this.sanitizer.bypassSecurityTrustUrl(url);
      // Limpiar la selección de archivo cuando se usa URL
      this.selectedImage = null;
    }
  }

  // Add this custom validator method to the component class
  ageValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null; // Let the required validator handle empty values
    }

    const birthDate = new Date(control.value);
    const today = new Date();

    // Calculate age
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // Adjust age if birthday hasn't occurred yet this year
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    // Check if user is at least 18 years old
    return age >= 18 ? null : { underage: true };
  }

  // Update the onSubmit method to check age before submitting
  onSubmit(): void {
    if (this.registerForm.invalid) {
      // Show specific error for underage users
      if (this.registerForm.get('data_naixement')?.hasError('underage')) {
        this.notificationService.showError('Debes ser mayor de 18 años para registrarte.');
      } else {
        this.notificationService.showError('Por favor, completa todos los campos correctamente.');
      }
      return;
    }

    if (this.registerForm.valid) {
      // Validaciones adicionales
      if (this.registerForm.value.pswd.length < 8) {
        this.notificationService.showError('La contraseña debe tener al menos 8 caracteres.');
        return;
      }

      if (!this.registerForm.value.terms) {
        this.notificationService.showError('Debes aceptar los términos y condiciones para continuar.');
        return;
      }

      // Create FormData object to send the image
      const formData = new FormData();

      // Add all form fields to FormData
      Object.keys(this.registerForm.value).forEach(key => {
        if (key !== 'profile_image' && key !== 'profileImageUrl' && key !== 'terms') {
          formData.append(key, this.registerForm.value[key]);
        }
      });

      // Add the image file if selected or use URL
      if (this.selectedImage) {
        formData.append('profile_image', this.selectedImage, this.selectedImage.name);
      } else if (this.registerForm.value.profileImageUrl) {
        formData.append('profile_image', this.registerForm.value.profileImageUrl);
      }

      this.authService.register(formData).subscribe({
        next: (response) => {
          console.log('Registration successful', response);
          this.notificationService.showSuccess('¡Registro exitoso! Ahora puedes iniciar sesión con tus credenciales.');

          // Force navigation after a short delay to ensure the notification is seen
          setTimeout(() => {
            this.router.navigate(['/login']).then(() => {
              console.log('Navigation to login completed');
            }).catch(err => {
              console.error('Navigation error:', err);
            });
          }, 2000);
        },
        error: (error) => {
          console.error('Registration failed', error);
          let errorMessage = 'Error en el registro. ';

          if (error.status === 422 && error.error?.errors) {
            // Laravel validation errors
            const errors = error.error.errors;

            // Manejar específicamente errores del nick
            if (errors.nick) {
              if (errors.nick.includes('The nick has already been taken.')) {
                errorMessage = 'Este nombre de usuario ya está en uso. Por favor, elige otro.';
              } else {
                errorMessage = 'Error en el nombre de usuario: ' + errors.nick.join(', ');
              }
            }
            // Manejar errores de email
            else if (errors.email) {
              if (errors.email.includes('The email has already been taken.')) {
                errorMessage = 'Este correo electrónico ya está registrado.';
              } else {
                errorMessage = 'Error en el correo electrónico: ' + errors.email.join(', ');
              }
            }
            // Manejar errores de DNI
            else if (errors.dni) {
              if (errors.dni.includes('The dni has already been taken.')) {
                errorMessage = 'Este DNI ya está registrado en el sistema.';
              } else {
                errorMessage = 'Error en el DNI: ' + errors.dni.join(', ');
              }
            }
            // Manejar errores de teléfono
            else if (errors.telefon) {
              if (errors.telefon.includes('The telefon has already been taken.')) {
                errorMessage = 'Este número de teléfono ya está registrado. Por favor, utiliza otro.';
              } else {
                errorMessage = 'Error en el número de teléfono: ' + errors.telefon.join(', ');
              }
            }
            // Otros errores de validación
            else {
              for (const field in errors) {
                errorMessage += `${errors[field].join(', ')} `;
              }
            }
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          } else {
            errorMessage = 'Error al registrar usuario. Por favor, verifica tus datos e intenta nuevamente.';
          }

          this.notificationService.showError(errorMessage);
        }
      });
    } else {
      let errorMessage = 'Por favor, completa todos los campos correctamente:';

      if (this.registerForm.get('nick')?.invalid) {
        errorMessage += '\n- El nombre de usuario es obligatorio.';
      }
      if (this.registerForm.get('email')?.invalid) {
        errorMessage += '\n- Introduce un correo electrónico válido.';
      }
      if (this.registerForm.get('pswd')?.invalid) {
        errorMessage += '\n- La contraseña debe tener al menos 8 caracteres.';
      }
      if (this.registerForm.get('dni')?.invalid) {
        errorMessage += '\n- El DNI debe tener 9 caracteres (8 números y 1 letra).';
      }
      if (this.registerForm.get('telefon')?.invalid) {
        errorMessage += '\n- El número de teléfono debe tener entre 9 y 15 dígitos.';
      }
      if (this.registerForm.get('data_naixement')?.invalid) {
        errorMessage += '\n- La fecha de nacimiento es obligatoria.';
      }

      this.notificationService.showError(errorMessage);
    }
  }

  // Add this method if it doesn't exist
  handleImageError(event: any): void {
    event.target.src = 'assets/logo-fallback.png';
  }

  // Añadir este método al componente
  navigateToHome(): void {
    this.router.navigate(['/']);
  }
}