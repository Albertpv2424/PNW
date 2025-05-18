import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // Remove RouterLink, keep Router
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
  imports: [CommonModule, FormsModule, ReactiveFormsModule], // Remove RouterLink
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

  // Update the form initialization in the constructor
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
      condicio: [1],
      imageUrl: [''] // New field for image URL instead of file upload
    });
  }

  ngOnInit(): void {
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
        this.prizes = data.map(prize => {
          let imageUrl = 'assets/premios/default.png';

          if (prize.image) {
            // If it's already a full URL, use it as is
            if (prize.image.startsWith('http')) {
              imageUrl = prize.image;
            }
            // If it's a relative path, prepend the API base URL
            else if (!prize.image.startsWith('assets/')) {
              imageUrl = `${environment.apiUrl.replace('/api', '')}/${prize.image}`;
            }
          }

          return {
            ...prize,
            image: imageUrl
          };
        });

        console.log('Processed prizes:', this.prizes);
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

  // Asegúrate de que estos métodos estén correctamente implementados
  openPrizeForm(prize?: Prize): void {
    console.log('openPrizeForm called with prize:', prize);
    this.selectedPrize = prize || null;
    this.isEditing = !!prize;

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
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.prizeForm.controls).forEach(key => {
        this.prizeForm.get(key)?.markAsTouched();
      });
      return;
    }

    const formData = this.prizeForm.value;

    // Create the data object to send
    const prizeData = {
      titol: formData.titol,
      descripcio: formData.descripcio,
      cost: formData.cost,
      condicio: formData.condicio,
      image: formData.imageUrl // Make sure this matches the field name in the form
    };

    console.log('Submitting prize data:', prizeData);

    // Set up request options
    const options = {
      headers: this.authService.getAuthHeaders()
    };

    // Submit the request - use the same pattern as promotions
    const endpoint = this.isEditing && this.selectedPrize
      ? `${environment.apiUrl}/admin/prizes/${this.selectedPrize.id}`
      : `${environment.apiUrl}/admin/prizes`;

    // Always use POST method, as defined in the Laravel routes
    this.http.post(endpoint, prizeData, options)
      .subscribe({
        next: (response) => {
          console.log('Prize operation successful:', response);
          this.notificationService.showSuccess(
            this.isEditing ? 'Premio actualizado correctamente' : 'Premio creado correctamente'
          );
          this.loadPrizes();
          this.closePrizeForm();
        },
        error: (error) => {
          console.error('Error in prize operation:', error);
          this.notificationService.showError(
            'Error: ' + (error.error?.message || 'No se pudo procesar la solicitud')
          );
        }
      });
  }

  // Add this method to handle image URL changes
  // Find and remove the duplicate onImageUrlChange and handleImageError methods
  // Keep only one implementation of each

  onImageUrlChange(): void {
    const imageUrl = this.prizeForm.get('imageUrl')?.value;
    if (imageUrl && imageUrl.trim() !== '') {
      this.imagePreview = imageUrl;
    } else {
      this.imagePreview = null;
    }
  }

  // Remove any other duplicate implementations of these methods

  confirmDeletePrize(id: number): void {
    console.log('confirmDeletePrize called with id:', id);
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

  // Add this method to your component class
  handleImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = 'assets/prizes/default.png';
    }
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
