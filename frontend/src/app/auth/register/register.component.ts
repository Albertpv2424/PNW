import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
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
      const userData = {
        ...this.registerForm.value,
        tipus_acc: 'Usuari',
        saldo: 0,
        temps_diari: 3600,
        bloquejat: false,
        apostes_realitzades: 0
      };

      this.authService.register(userData).subscribe({
        next: (response) => {
          console.log('Registration successful', response);
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Registration failed', error);
          console.log('Error details:', error.error); // Add this to see detailed error
        }
      });
    } else {
      console.log('Form validation errors:', this.registerForm.errors);
      console.log('Form values:', this.registerForm.value);
    }
  }
  // Add this method
  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}