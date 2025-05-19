
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // Remove RouterLink, keep Router
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { AdminService } from '../../services/admin.service';
import { environment } from '../../../environments/environment';
import { catchError, tap, throwError } from 'rxjs'; // Add these imports

// Update the PromocionAPI interface
interface PromocionAPI {
  id: number;
  titol: string;
  descripcio: string;
  data_inici: string;
  data_final: string;
  tipus_promocio: number; // This matches the database column name
  image: string | null;   // This matches the database column name
  tipoPromocion?: {
    titol: string;
  };
}
interface TipoPromocion {
  id: number;
  titol: string;
}

@Component({
  selector: 'app-promotions',
  templateUrl: './promotions.component.html',
  styleUrls: ['./promotions.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule] // Remove RouterLink
})
export class PromotionsComponent implements OnInit {
  promociones: PromocionAPI[] = [];
  filteredPromociones: PromocionAPI[] = [];
  tiposPromocion: TipoPromocion[] = [];
  selectedPromocion: PromocionAPI | null = null;
  isLoading: boolean = true;
  searchTerm: string = '';
  showPromocionForm: boolean = false;
  promocionForm: FormGroup;
  isEditing: boolean = false;
  showDeleteConfirm: boolean = false;
  deletePromocionId: number | null = null;
  imagePreview: string | null = null;
  selectedFile: File | null = null;
  selectedFileName: string | null = null;

  // Update the form initialization in the constructor
  constructor(
    private http: HttpClient,
    public authService: AuthService,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.promocionForm = this.fb.group({
      titol: ['', [Validators.required]],
      descripcio: ['', [Validators.required]],
      data_inici: ['', [Validators.required]],
      data_final: ['', [Validators.required]],
      tipus_promocio: ['', [Validators.required]], // Changed to match the API model
      imageUrl: [''] // Changed from 'image' to 'imageUrl' to match your form
    });
  }

  ngOnInit(): void {
    const isLoggedIn = this.authService.isLoggedIn();

    // Check admin status
    const isAdmin = this.authService.isAdmin();

    // Get current user
    const currentUser = this.authService.getCurrentUser();

    if (!isAdmin) {
      this.notificationService.showError('No tienes permisos de administrador para acceder a esta sección.');
      this.router.navigate(['/']);
      return;
    }

    this.loadPromociones();
    this.loadTiposPromocion();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  loadPromociones(): void {
    this.isLoading = true;


    const token = this.authService.getToken();

    const headers = this.authService.getAuthHeaders();

    this.http.get<PromocionAPI[]>(`${environment.apiUrl}/admin/promotions`, {
      headers: this.authService.getAuthHeaders()
    }).subscribe({
      next: (data) => {
        this.promociones = data.map(promocion => {
          let imageUrl = 'assets/promociones/default.png';

          if (promocion.image) {
            // If it's already a full URL, use it as is
            if (promocion.image.startsWith('http')) {
              imageUrl = promocion.image;
            }
            // If it's a relative path, prepend the API base URL
            else if (!promocion.image.startsWith('assets/')) {
              imageUrl = `${environment.apiUrl.replace('/api', '')}/${promocion.image}`;
            }
          }

          return {
            ...promocion,
            image_url: imageUrl // Add this for compatibility with existing code
          };
        });

        this.filteredPromociones = [...this.promociones];
        this.isLoading = false;
      },
      error: (error) => {

        if (error.status === 403) {
          this.notificationService.showError('No tienes permisos de administrador para acceder a esta sección.');
        } else if (error.status === 401) {
          this.notificationService.showError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
          this.authService.logout();
          this.router.navigate(['/login']);
        } else {
          this.notificationService.showError('Error al cargar las promociones: ' + (error.error?.message || 'Error desconocido'));
        }

        this.isLoading = false;
      }
    });
  }

  loadTiposPromocion(): void {
    const token = this.authService.getToken();

    const headers = this.authService.getAuthHeaders();

    // Try with the correct endpoint URL
    this.http.get<TipoPromocion[]>(`${environment.apiUrl}/admin/tipos-promocion`, {
      headers: this.authService.getAuthHeaders()
    }).subscribe({
      next: (data) => {
        if (Array.isArray(data) && data.length > 0) {
          this.tiposPromocion = data;
          // Force refresh of the promotion list
          this.filteredPromociones = [...this.promociones];
        } else {
        }
      },
      error: (error) => {
        this.notificationService.showError('Error al cargar los tipos de promoción: ' + (error.error?.message || 'Error desconocido'));
      }
    });
  }

  searchPromociones(): void {
    if (!this.searchTerm.trim()) {
      this.filteredPromociones = [...this.promociones];
      return;
    }

    const term = this.searchTerm.toLowerCase().trim();
    this.filteredPromociones = this.promociones.filter(promocion =>
      promocion.titol.toLowerCase().includes(term) ||
      promocion.descripcio.toLowerCase().includes(term)
    );
  }

  // Add the missing methods that are referenced in the template
  openPromocionForm(promocion?: PromocionAPI): void {
    if (promocion) {
      this.isEditing = true;
      this.selectedPromocion = promocion;
      this.promocionForm.patchValue({
        titol: promocion.titol,
        descripcio: promocion.descripcio,
        data_inici: promocion.data_inici,
        data_final: promocion.data_final,
        tipus_promocio: promocion.tipus_promocio,
        imageUrl: promocion.image
      });
      this.imagePreview = promocion.image || null;
    } else {
      this.isEditing = false;
      this.selectedPromocion = null;
      this.promocionForm.reset({
        titol: '',
        descripcio: '',
        data_inici: '',
        data_final: '',
        tipus_promocio: '',
        imageUrl: ''
      });
      this.imagePreview = null;
    }
    this.showPromocionForm = true;
  }

  closePromocionForm(): void {
    this.showPromocionForm = false;
    this.promocionForm.reset();
    this.selectedPromocion = null;
    this.isEditing = false;
    this.imagePreview = null;
  }

  onImageUrlChange(): void {
    const imageUrl = this.promocionForm.get('imageUrl')?.value;
    if (imageUrl && imageUrl.trim() !== '') {
      this.imagePreview = imageUrl;
    } else {
      this.imagePreview = null;
    }
  }

  submitPromocionForm(): void {
    if (this.promocionForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.promocionForm.controls).forEach(key => {
        this.promocionForm.get(key)?.markAsTouched();
      });
      this.notificationService.showError('Por favor, completa todos los campos requeridos correctamente');
      return;
    }

    const formValues = this.promocionForm.value;

    // Create the data object to send
    const promocionData = {
      titol: formValues.titol,
      descripcio: formValues.descripcio,
      data_inici: formValues.data_inici,
      data_final: formValues.data_final,
      tipus_promocio_id: formValues.tipus_promocio, // This is the field name expected by the controller
      image: formValues.imageUrl // This is the field name expected by the controller
    };


    // Set up request options
    const options = {
      headers: this.authService.getAuthHeaders()
    };

    // Submit the request
    this.submitRequest(promocionData, options);
  }

  confirmDelete(id: number): void {
    this.deletePromocionId = id;
    this.showDeleteConfirm = true;
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
    this.deletePromocionId = null;
  }

  deletePromocion(): void {
    if (!this.deletePromocionId) {
      return;
    }
    this.http.delete(`${environment.apiUrl}/admin/promotions/${this.deletePromocionId}`, {
      headers: this.authService.getAuthHeaders()
    }).subscribe({
      next: (response) => {
        this.notificationService.showSuccess('Promoción eliminada correctamente');
        this.loadPromociones();
        this.cancelDelete();
        this.showDeleteConfirm = false;
        this.deletePromocionId = null;
      },
      error: (error) => {
        this.notificationService.showError('Error al eliminar la promoción:'+ (error.error?.message || 'Error desconocido'));
      }
    });
  }

  getTipoPromocionName(id: number): string {
    // Add debugging to see what's happening

    if (!id) return 'No especificado';

    // Convert id to number to ensure proper comparison
    const numericId = Number(id);
    const tipo = this.tiposPromocion.find(t => Number(t.id) === numericId);

    if (tipo) {
      return tipo.titol;
    } else {
      return 'No especificado';
    }
  }






private submitRequest(data: any, options: any): void {
  const endpoint = this.isEditing && this.selectedPromocion
    ? `${environment.apiUrl}/admin/promotions/${this.selectedPromocion.id}`
    : `${environment.apiUrl}/admin/promotions`;

  this.http.post(endpoint, data, options).subscribe({
    next: (response) => {
      this.notificationService.showSuccess(
        this.isEditing ? 'Promoción actualizada correctamente' : 'Promoción creada correctamente'
      );
      this.loadPromociones();
      this.closePromocionForm();
    },
    error: (error) => {
      this.notificationService.showError(
        `Error al ${this.isEditing ? 'actualizar' : 'crear'} la promoción: ` +
        (error.error?.message || error.statusText || 'Error desconocido')
      );
    }
  });
}
handleImageError(event: Event): void {
  const target = event.target as HTMLImageElement;
  if (target) {
    target.src = 'assets/promociones/default.png';
  }
}
}