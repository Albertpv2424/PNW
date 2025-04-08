import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { environment } from '../../environments/environment';
import { ChatService } from '../services/chat.service';
import { NotificationService } from '../services/notification.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TranslateModule],
  templateUrl: './support.component.html',
  styleUrl: './support.component.css'
})
export class SupportComponent {
  supportForm: FormGroup;
  isSubmitting = false;
  submitSuccess = false;
  submitError = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private notificationService: NotificationService,
    // Change from private to public so it can be accessed from the template
    public chatService: ChatService
  ) {
    this.supportForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      issueType: ['', [Validators.required]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit() {
    if (this.supportForm.invalid) {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.supportForm.controls).forEach(key => {
        this.supportForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;
    this.submitError = '';

    const formData = {
      name: this.supportForm.value.name,
      email: this.supportForm.value.email,
      issueType: this.supportForm.value.issueType,
      message: this.supportForm.value.message,
      to: 'predictnwinmail@gmail.com'
    };

    this.http.post(`${environment.apiUrl}/contact`, formData)
      .subscribe({
        next: (response: any) => {
          this.isSubmitting = false;
          this.submitSuccess = true;
          this.supportForm.reset();
          setTimeout(() => {
            this.submitSuccess = false;
          }, 5000);
        },
        error: (error) => {
          this.isSubmitting = false;
          if (error.error && error.error.message) {
            this.submitError = error.error.message;
          } else {
            this.submitError = 'Ha ocurrido un error al enviar el mensaje. Por favor, inténtalo de nuevo.';
          }
        }
      });
  }

  // Helpers para validación de formulario
  get nameControl() { return this.supportForm.get('name'); }
  get emailControl() { return this.supportForm.get('email'); }
  get issueTypeControl() { return this.supportForm.get('issueType'); }
  get messageControl() { return this.supportForm.get('message'); }

  openChat(): void {
    // Abrir el chat usando el servicio de chat
    this.chatService.setChatOpen(true);
  }
}
