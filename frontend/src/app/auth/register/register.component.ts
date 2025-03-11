import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router'; // Make sure RouterLink is imported
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink], // Add RouterLink to imports
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  showPassword = false;
  logoPath: string = '/assets/logo.jpg';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.registerForm = this.fb.group({
      nick: ['', Validators.required],  // Changed from username
      email: ['', [Validators.required, Validators.email]],
      pswd: ['', Validators.required],  // Changed from password
      dni: ['', [Validators.required, Validators.pattern('^[0-9]{8}[A-Z]$')]],
      telefon: ['', Validators.pattern('^[0-9]{9,15}$')],  // Changed from phone
      data_naixement: ['', Validators.required],  // Changed from birthDate
      terms: [false, Validators.requiredTrue]
    });
  }

  ngOnInit(): void {
    // Remove the throw error
  }

  onSubmit() {
    if (this.registerForm.valid) {
      // Validaciones adicionales
      if (this.registerForm.value.pswd.length < 8) {
        alert('La contraseña debe tener al menos 8 caracteres.');
        return;
      }
      
      if (!this.registerForm.value.terms) {
        alert('Debes aceptar los términos y condiciones para continuar.');
        return;
      }
      
      const userData = this.registerForm.value;
      this.authService.register(userData).subscribe({
        next: (response) => {
          console.log('Registration successful', response);
          alert('¡Registro exitoso! Ahora puedes iniciar sesión con tus credenciales.');
          this.router.navigate(['/login']);
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
          
          alert(errorMessage);
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
      
      alert(errorMessage);
    }
  }
  
  // Add this method
  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}