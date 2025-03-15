import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { RouterLink, ActivatedRoute, Router } from '@angular/router'; // Add Router here
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotificationService } from '../services/notification.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PredictionsService } from '../services/predictions.service';

// Add this interface to your profile component
interface RedeemedPrize {
  id: number;
  premio_id: number;
  titulo: string;
  descripcion: string;
  image: string;
  cost: number;
  fecha_canje: string;
  fecha_limite: string;
  usado: boolean;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  username: string = '';
  email: string = '';
  profileImage: string | null = null;
  saldo: number = 0;
  dni: string = '';
  telefon: string = '';
  dataNaixement: string = '';

  // Para la edición de perfil
  editMode: boolean = false;
  profileForm: FormGroup;
  imagePreview: string | null = null;
  selectedFile: File | null = null;

  // Add this property to your ProfileComponent class
  redeemedPrizes: RedeemedPrize[] = [];
  loadingPrizes = false;
  prizesError = '';

  // Add this to your constructor
  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router, // Add Router to constructor
    private predictionsService: PredictionsService,
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private http: HttpClient
  ) {
    this.profileForm = this.fb.group({
      nick: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefon: [''],
      current_password: [''],
      new_password: [''],
      confirm_password: ['']
    });
  }

  // Add this method to your ProfileComponent class
  loadUserPrizes(): void {
    this.loadingPrizes = true;
    this.prizesError = '';

    this.predictionsService.getUserPremios().subscribe({
      next: (data: RedeemedPrize[]) => {
        this.redeemedPrizes = data;
        this.loadingPrizes = false;
      },
      error: (error) => {
        console.error('Error loading user prizes:', error);
        this.prizesError = 'No se pudieron cargar los premios canjeados.';
        this.loadingPrizes = false;
      }
    });
  }

  // Update ngOnInit to call this method
  ngOnInit(): void {
    // Determinar si estamos en modo edición
    this.route.url.subscribe(segments => {
      this.editMode = segments.some(segment => segment.path === 'edit');
    });

    const user = this.authService.getCurrentUser();
    if (user) {
      this.username = user.nick;
      this.email = user.email;
      this.profileImage = user.profile_image || null;
      this.saldo = user.saldo;
      this.dni = user.dni;
      this.telefon = user.telefon || '';
      this.dataNaixement = user.data_naixement;

      // Inicializar el formulario con los datos del usuario
      this.profileForm.patchValue({
        nick: user.nick,
        email: user.email,
        telefon: user.telefon || ''
      });
    }
    this.loadUserPrizes();
  }

  getInitials(): string {
    if (!this.username) return '';

    const names = this.username.split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    } else {
      return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
    }
  }

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      // Crear una URL para la vista previa
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  updateProfile(): void {
    if (this.profileForm.invalid) {
      return;
    }

    // Crear FormData para enviar los datos
    const formData = new FormData();
    formData.append('nick', this.profileForm.value.nick);
    formData.append('email', this.profileForm.value.email);
    formData.append('telefon', this.profileForm.value.telefon || '');

    if (this.profileForm.value.current_password) {
      formData.append('current_password', this.profileForm.value.current_password);
      formData.append('new_password', this.profileForm.value.new_password);
    }

    if (this.selectedFile) {
      formData.append('profile_image', this.selectedFile);
    }

    // Ya no necesitamos enviar el token de aut
    const token = localStorage.getItem('token');

    // Create headers with the token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // Send the request with the token in headers
    this.http.post('http://localhost:8000/api/update-profile', formData, { headers })
      .subscribe({
        next: (response: any) => {
          this.notificationService.showSuccess('Perfil actualizado correctamente');

          // Update user data in localStorage and service
          if (response.user) {
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            this.authService.updateCurrentUser(response.user);

            // Update local data
            this.username = response.user.nick;
            this.email = response.user.email;
            this.profileImage = response.user.profile_image || null;
            this.telefon = response.user.telefon || '';

            // Clear password fields
            this.profileForm.patchValue({
              current_password: '',
              new_password: '',
              confirm_password: ''
            });

            // Return to profile view and navigate to profile page
            this.editMode = false;
            this.router.navigate(['/profile']); // Add this line to redirect
          }
        },
        error: (error) => {
          console.error('Error updating profile:', error);
          let errorMessage = 'Error al actualizar el perfil.';

          if (error.status === 401) {
            errorMessage = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          }

          this.notificationService.showError(errorMessage);
        }
      });
  }
}
