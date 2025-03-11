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
      // Crear una copia del objeto userData para asegurarnos de que tiene el formato correcto
      const userData = {
        nick: this.registerForm.value.nick,
        email: this.registerForm.value.email,
        pswd: this.registerForm.value.pswd,
        dni: this.registerForm.value.dni,
        telefon: this.registerForm.value.telefon || '',  // Asegurarse de que no sea null/undefined
        data_naixement: this.registerForm.value.data_naixement
        // No enviamos terms ya que el backend probablemente no lo espera
      };
      
      console.log('Sending registration data:', userData);
      
      this.authService.register(userData).subscribe({
        next: (response) => {
          console.log('Registration successful', response);
          alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Registration failed', error);
          let errorMessage = 'Error en el registro. ';
          
          // Mostrar mensajes de error específicos si están disponibles
          if (error.error && error.error.errors) {
            const errors = error.error.errors;
            for (const field in errors) {
              errorMessage += `${errors[field].join(', ')} `;
            }
          } else if (error.error && error.error.message) {
            errorMessage += error.error.message;
          } else {
            errorMessage += 'Por favor, verifica tus datos e intenta nuevamente.';
          }
          
          alert(errorMessage);
        }
      });
    } else {
      console.log('Form validation errors:', this.registerForm.errors);
      alert('Por favor, completa todos los campos correctamente.');
    }
  }
  
  // Add this method
  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}