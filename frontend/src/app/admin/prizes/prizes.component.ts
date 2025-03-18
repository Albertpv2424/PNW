import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { environment } from '../../../environments/environment';

interface Prize {
  id: number;
  titol: string;
  descripcio: string;
  cost: number;
  condicio: number;
  image: string;
}

@Component({
  selector: 'app-prizes',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './prizes.component.html',
  styleUrls: ['../shared/admin-shared.css', './prizes.component.css']
})
export class PrizesComponent implements OnInit {
  prizes: Prize[] = [];
  filteredPrizes: Prize[] = [];
  selectedPrize: Prize | null = null;
  isLoading: boolean = true;
  searchTerm: string = '';
  showPrizeForm: boolean = false;
  prizeForm: FormGroup;
  isEditing: boolean = false;
  showDeleteConfirm: boolean = false;
  deletePrizeId: number | null = null;
  imagePreview: string | null = null;
  selectedFile: File | null = null;

  constructor(
    private http: HttpClient,
    public authService: AuthService,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.prizeForm = this.fb.group({
      titol: ['', [Validators.required]],
      descripcio: ['', [Validators.required]],
      cost: [100, [Validators.required, Validators.min(1)]],
      condicio: [1]
    });
  }

  ngOnInit(): void {
    console.log('PrizesComponent initialized');

    // Check authentication status
    const isLoggedIn = this.authService.isLoggedIn();
    console.log('User is logged in:', isLoggedIn);

    // Check admin status
    const isAdmin = this.authService.isAdmin();
    console.log('User is admin:', isAdmin);

    // Get current user
    const currentUser = this.authService.getCurrentUser();
    console.log('Current user:', currentUser);

    // Check if user is admin before loading prizes
    if (!isAdmin) {
      console.error('User is not admin, redirecting to home');
      this.notificationService.showError('No tienes permisos de administrador para acceder a esta sección.');
      this.router.navigate(['/']);
      return;
    }

    // Add debugging to see if this component is being loaded
    console.log('Loading prizes from API');
    this.loadPrizes();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  loadPrizes(): void {
    this.isLoading = true;

    console.log('Starting loadPrizes method');

    // Get token and log first 10 characters
    const token = this.authService.getToken();
    console.log('Using token (first 10 chars):', token ? token.substring(0, 10) + '...' : 'No token');

    // Log headers being sent
    const headers = this.authService.getAuthHeaders();
    console.log('Headers:', headers);

    this.http.get<Prize[]>(`${environment.apiUrl}/admin/prizes`, {
      headers: this.authService.getAuthHeaders()
    }).subscribe({
      next: (data: Prize[]) => {
        console.log('Prizes loaded successfully:', data.length);
        this.prizes = data.map(prize => ({
          ...prize,
          // Corregir la URL de la imagen para que apunte al servidor correcto
          image: prize.image ? `http://localhost:8000/${prize.image}` : 'assets/premios/default.png'
        }));
        this.filteredPrizes = [...this.prizes];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading prizes:', error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.error?.message || 'Unknown error');

        if (error.status === 403) {
          this.notificationService.showError('No tienes permisos de administrador para acceder a esta sección.');
        } else if (error.status === 401) {
          this.notificationService.showError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
          this.authService.logout();
          this.router.navigate(['/login']);
        } else {
          this.notificationService.showError('Error al cargar los premios: ' + (error.error?.message || 'Error desconocido'));
        }

        this.isLoading = false;
      }
    });
  }

  searchPrizes(): void {
    if (!this.searchTerm.trim()) {
      this.filteredPrizes = [...this.prizes];
      return;
    }

    const term = this.searchTerm.toLowerCase().trim();
    this.filteredPrizes = this.prizes.filter(prize =>
      prize.titol.toLowerCase().includes(term) ||
      prize.descripcio.toLowerCase().includes(term)
    );
  }

  openPrizeForm(prize: Prize | null = null): void {
    this.isEditing = !!prize;
    this.selectedPrize = prize;
    this.imagePreview = null;
    this.selectedFile = null;

    if (prize) {
      // Editing existing prize
      this.prizeForm.patchValue({
        titol: prize.titol,
        descripcio: prize.descripcio,
        cost: prize.cost,
        condicio: prize.condicio
      });

      // Show current image
      if (prize.image && !prize.image.includes('default.png')) {
        this.imagePreview = prize.image;
      }
    } else {
      // Creating new prize
      this.prizeForm.reset({
        titol: '',
        descripcio: '',
        cost: 100,
        condicio: 1
      });
    }

    this.showPrizeForm = true;
  }

  closePrizeForm(): void {
    this.showPrizeForm = false;
    this.prizeForm.reset();
    this.imagePreview = null;
    this.selectedFile = null;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  submitPrizeForm(): void {
    if (this.prizeForm.invalid) {
      this.notificationService.showError('Por favor, completa todos los campos requeridos correctamente');
      return;
    }

    const formData = new FormData();
    const prizeData = this.prizeForm.value;

    // Add form fields to FormData
    formData.append('titol', prizeData.titol);
    formData.append('descripcio', prizeData.descripcio);
    formData.append('cost', prizeData.cost);
    formData.append('condicio', prizeData.condicio || '1');

    // Add image if selected
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    if (this.isEditing && this.selectedPrize) {
      // Update existing prize
      this.http.post(`${environment.apiUrl}/admin/prizes/${this.selectedPrize.id}`, formData, {
        headers: this.authService.getAuthHeaders() // Remove the 'true' parameter
      }).subscribe({
        next: (response) => {
          this.notificationService.showSuccess('Premio actualizado correctamente');
          this.loadPrizes();
          this.closePrizeForm();
        },
        error: (error) => {
          console.error('Error updating prize:', error);
          this.notificationService.showError('Error al actualizar el premio');
        }
      });
    } else {
      // Create new prize
      this.http.post(`${environment.apiUrl}/admin/prizes`, formData, {
        headers: this.authService.getAuthHeaders() // Remove the 'true' parameter
      }).subscribe({
        next: (response) => {
          this.notificationService.showSuccess('Premio creado correctamente');
          this.loadPrizes();
          this.closePrizeForm();
        },
        error: (error) => {
          console.error('Error creating prize:', error);
          this.notificationService.showError('Error al crear el premio');
        }
      });
    }
  }

  confirmDeletePrize(id: number): void {
    this.deletePrizeId = id;
    this.showDeleteConfirm = true;
  }

  cancelDeletePrize(): void {
    this.deletePrizeId = null;
    this.showDeleteConfirm = false;
  }

  deletePrize(): void {
    if (!this.deletePrizeId) {
      this.notificationService.showError('ID de premio no válido');
      return;
    }

    this.http.delete(`${environment.apiUrl}/admin/prizes/${this.deletePrizeId}`, {
      headers: this.authService.getAuthHeaders()
    }).subscribe({
      next: (response) => {
        this.notificationService.showSuccess('Premio eliminado correctamente');
        this.loadPrizes();
        this.cancelDeletePrize();
      },
      error: (error) => {
        console.error('Error deleting prize:', error);
        this.notificationService.showError('Error al eliminar el premio');
      }
    });
  }

  // Método para manejar errores de carga de imágenes
  handleImageError(prize: Prize): void {
    console.log('Error loading image for prize:', prize.id);
    prize.image = 'assets/premios/default.png';
  }

  // Añadir este método después del método handleImageError
  getPrizeInitials(title: string): string {
    if (!title) return '?';

    const words = title.split(' ');
    if (words.length === 1) {
      return title.substring(0, 2).toUpperCase();
    }

    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  }
}
