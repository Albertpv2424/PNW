import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../services/notification.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;
  isSubmitting = false;
  apiUrl = environment.apiUrl;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private notificationService: NotificationService
  ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      issueType: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    // Initialization code if needed
  }

  submitForm() {
    console.log('Submit form called');
    
    // Log each form control's validity state
    Object.keys(this.contactForm.controls).forEach(key => {
      const control = this.contactForm.get(key);
      console.log(`Control ${key}: valid=${control?.valid}, errors=`, control?.errors);
    });
    
    if (this.contactForm.invalid) {
      console.log('Form is invalid', this.getFormValidationErrors());
      
      // Show specific error messages based on which fields are invalid
      let errorMessage = 'Por favor, completa todos los campos correctamente:';
      const errors = this.getFormValidationErrors();
      
      if (errors.length > 0) {
        errors.forEach(err => {
          errorMessage += `\n- ${err.name}: ${err.error}`;
        });
      }
      
      this.notificationService.showError(errorMessage);
      return;
    }

    this.isSubmitting = true;
    
    // Asegurarse de que se incluye el campo 'to'
    const formData = {
      ...this.contactForm.value,
      to: 'predictnwinmail@gmail.com' // Añadir explícitamente el destinatario
    };
    
    console.log('Enviando formulario de contacto:', formData);

    // Use direct URL to avoid any routing issues
    this.http.post(`${this.apiUrl}/contact`, formData).subscribe({
      next: (response: any) => {
        console.log('Respuesta del servidor:', response);
        this.notificationService.showSuccess('Mensaje enviado con éxito');
        this.contactForm.reset();
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('Error al enviar el mensaje:', error);
        this.notificationService.showError('Error al enviar el mensaje: ' + (error.error?.message || 'Por favor, inténtalo de nuevo.'));
        this.isSubmitting = false;
      }
    });
  }

  // Helper method to get all validation errors
  getFormValidationErrors() {
    const errors: { name: string; error: string }[] = [];
    
    Object.keys(this.contactForm.controls).forEach(key => {
      const control = this.contactForm.get(key);
      if (control && control.invalid) {
        if (control.errors?.['required']) {
          errors.push({ name: this.getFieldName(key), error: 'Este campo es obligatorio' });
        }
        if (control.errors?.['email']) {
          errors.push({ name: this.getFieldName(key), error: 'Formato de email inválido' });
        }
        if (control.errors?.['minlength']) {
          errors.push({ 
            name: this.getFieldName(key), 
            error: `Debe tener al menos ${control.errors?.['minlength'].requiredLength} caracteres` 
          });
        }
      }
    });
    
    return errors;
  }

  // Helper method to get user-friendly field names
  getFieldName(controlName: string): string {
    const fieldNames: {[key: string]: string} = {
      'name': 'Nombre',
      'email': 'Correo electrónico',
      'issueType': 'Asunto',
      'message': 'Mensaje'
    };
    
    return fieldNames[controlName] || controlName;
  }
}
