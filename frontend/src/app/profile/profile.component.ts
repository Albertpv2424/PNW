// Update the imports at the top of the file
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { PredictionsService } from '../services/predictions.service';
import { NotificationService } from '../services/notification.service';
import { FormsModule } from '@angular/forms';
import { BetService } from '../services/bet.service';
import { ProfileHeaderComponent } from '../profile-header/profile-header.component';
import { TranslateModule } from '@ngx-translate/core'; // Add this import

// Añadir la interfaz RedeemedPrize que falta
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

// Update the component imports
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    FormsModule,
    ProfileHeaderComponent,
    TranslateModule // Add this line to import the module
  ],
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

  // Add stats property
  stats = {
    totalBets: 0,
    wonBets: 0,
    lostBets: 0,
    pendingBets: 0,
    totalWinnings: 0,
    winRate: 0
  };

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
    private http: HttpClient,
    private betService: BetService // Añadir BetService
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
  // Añadir propiedad para almacenar las apuestas recientes
  recentBets: any[] = [];
  loadingRecentBets = false;

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
    this.loadBetStats(); // Añadir carga de estadísticas
    this.loadRecentBets(); // Añadir esta línea
  }

  // Añadir método para cargar estadísticas
  loadBetStats(): void {
    this.betService.getUserBetStats().subscribe({
      next: (data) => {
        this.stats = {
          totalBets: data.totalBets || 0,
          wonBets: data.wonBets || 0,
          lostBets: data.lostBets || 0,
          pendingBets: data.pendingBets || 0,
          totalWinnings: data.totalWinnings || 0,
          winRate: data.winRate || 0
        };
      },
      error: (error) => {
        console.error('Error loading bet statistics:', error);
      }
    });
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

  // Add these properties to your ProfileComponent class
  // (Add this near the top of the class with other property declarations)
  // Properties for the modal de eliminación de cuenta
  showDeleteModal: boolean = false;
  deleteConfirmText: string = '';

  // Add these methods to your ProfileComponent class
  // (Add these methods near the bottom of the class)

  // Método para mostrar el modal de confirmación
  showDeleteConfirmation(): void {
    this.showDeleteModal = true;
    this.deleteConfirmText = '';
  }

  // Método para cancelar la eliminación
  cancelDelete(): void {
    this.showDeleteModal = false;
  }

  // Método para eliminar la cuenta - modificado para usar POST en lugar de DELETE
  deleteAccount(): void {
    if (this.deleteConfirmText !== 'ELIMINAR') {
      return;
    }

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    // Usar POST en lugar de DELETE
    this.http.post('http://localhost:8000/api/delete-account', {}, { headers })
      .subscribe({
        next: () => {
          this.notificationService.showSuccess('Tu cuenta ha sido eliminada correctamente');
          this.authService.logout();
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Error al eliminar la cuenta:', error);
          let errorMessage = 'Error al eliminar la cuenta.';

          if (error.status === 401) {
            errorMessage = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          }

          this.notificationService.showError(errorMessage);
          this.showDeleteModal = false;
        }
      });
  }

  // Add these properties to fix the template error
  isBetsView = false;
  isHistoryView = false;

  // Añadir método para cargar las apuestas recientes
  loadRecentBets(): void {
    this.loadingRecentBets = true;
    this.betService.getUserBetHistory().subscribe({
      next: (data) => {
        // Tomar solo las 3 apuestas más recientes
        this.recentBets = data.slice(0, 3);
        this.loadingRecentBets = false;
      },
      error: (error) => {
        console.error('Error loading recent bets:', error);
        this.loadingRecentBets = false;
      }
    });
  }

  // Añadir método para formatear la fecha
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  // Añadir método para obtener la clase CSS según el estado
  getStatusClass(status: string): string {
    const statusLower = status.toLowerCase();
    if (statusLower === 'ganada') return 'status-won';
    if (statusLower === 'perdida') return 'status-lost';
    return 'status-pending';
  }
  
  // Add this method to translate bet status
  getTranslatedStatus(status: string): string {
    const statusLower = status.toLowerCase();
    if (statusLower === 'ganada') return 'BETS.WON';
    if (statusLower === 'perdida') return 'BETS.LOST';
    if (statusLower === 'pendiente') return 'BETS.PENDING';
    if (statusLower === 'cancelada') return 'BETS.CANCELED';
    return status;
  }
}
