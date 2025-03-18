import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { AdminService } from '../../services/admin.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

// Interface definitions remain the same
interface PromocionAPI {
  id: number;
  titol: string;
  descripcio: string;
  data_inici: string;
  data_final: string;
  image: string | null;
  tipo_promocion_id: number;
  tipoPromocion?: {
    id: number;
    titol: string;
  };
}

interface TipoPromocion {
  id: number;
  titol: string;
}

@Component({
  selector: 'app-admin-promotions',
  templateUrl: './promotions.component.html',
  styleUrls: ['./promotions.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink]
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
  selectedFileName: string | null = null; // Add this property

  constructor(
    private http: HttpClient,
    public authService: AuthService,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    private router: Router,
    private adminService: AdminService
  ) {
    this.promocionForm = this.fb.group({
      titol: ['', [Validators.required]],
      descripcio: ['', [Validators.required]],
      data_inici: ['', [Validators.required]],
      data_final: ['', [Validators.required]],
      tipo_promocion_id: ['', [Validators.required]],
      image: ['']
    });
  }

  ngOnInit(): void {
    if (!this.authService.isAdmin()) {
      this.notificationService.showError('No tienes permisos para acceder a esta sección');
      this.router.navigate(['/login']);
      return;
    }

    this.loadPromociones();
    this.loadTiposPromocion();
  }

  loadPromociones(): void {
    this.isLoading = true;
    console.log('Cargando promociones...');

    this.adminService.getPromociones().subscribe({
      next: (data) => {
        console.log('Promociones cargadas:', data);
        this.promociones = data;
        this.filteredPromociones = [...this.promociones];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading promociones:', error);

        if (error.status === 403) {
          this.notificationService.showError('No tienes permisos de administrador para acceder a esta sección.');
        } else if (error.status === 401) {
          this.notificationService.showError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
          this.authService.logout();
        } else {
          this.notificationService.showError('Error al cargar las promociones: ' + (error.error?.message || 'Error desconocido'));
        }

        this.isLoading = false;
      }
    });
  }

  loadTiposPromocion(): void {
    this.adminService.getTiposPromocion().subscribe({
      next: (data) => {
        console.log('Tipos de promoción cargados:', data);
        this.tiposPromocion = data;
      },
      error: (error) => {
        console.error('Error loading tipos promocion:', error);
        this.notificationService.showError('Error al cargar los tipos de promoción');
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

  openPromocionForm(promocion?: PromocionAPI): void {
    this.isEditing = !!promocion;
    this.selectedPromocion = promocion || null;
    this.imagePreview = null;
    this.selectedFile = null;

    if (promocion) {
      // Format dates for the date input (YYYY-MM-DD)
      const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
      };

      this.promocionForm.patchValue({
        titol: promocion.titol,
        descripcio: promocion.descripcio,
        data_inici: formatDate(promocion.data_inici),
        data_final: formatDate(promocion.data_final),
        tipo_promocion_id: promocion.tipo_promocion_id
      });

      if (promocion.image) {
        this.imagePreview = promocion.image.startsWith('http')
          ? promocion.image
          : `${environment.apiUrl.replace('/api', '')}/${promocion.image}`;
      }
    } else {
      this.promocionForm.reset();

      // Set default dates (today and a month from today)
      const today = new Date();
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      this.promocionForm.patchValue({
        data_inici: today.toISOString().split('T')[0],
        data_final: nextMonth.toISOString().split('T')[0]
      });
    }

    this.showPromocionForm = true;
  }

  closePromocionForm(): void {
    this.showPromocionForm = false;
    this.selectedPromocion = null;
    this.promocionForm.reset();
    this.imagePreview = null;
    this.selectedFile = null;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.selectedFileName = file.name; // Set the file name

      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  savePromocion(): void {
    if (this.promocionForm.invalid) {
      this.notificationService.showError('Por favor, completa todos los campos requeridos correctamente.');
      return;
    }

    const formData = new FormData();
    const formValue = this.promocionForm.value;

    // Add form fields to FormData
    formData.append('titol', formValue.titol);
    formData.append('descripcio', formValue.descripcio);
    formData.append('data_inici', formValue.data_inici);
    formData.append('data_final', formValue.data_final);
    formData.append('tipo_promocion_id', formValue.tipo_promocion_id);

    // Add file if selected
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    if (this.isEditing && this.selectedPromocion) {
      // Update existing promocion - use adminService instead of direct http call
      this.adminService.updatePromocion(this.selectedPromocion.id, formData).subscribe({
        next: (response: any) => {
          this.notificationService.showSuccess('Promoción actualizada con éxito');
          this.closePromocionForm();
          this.loadPromociones();
        },
        error: (error) => {
          console.error('Error updating promocion:', error);
          this.notificationService.showError('Error al actualizar la promoción: ' + (error.error?.message || 'Error desconocido'));
        }
      });
    } else {
      // Create new promocion - use adminService instead of direct http call
      this.adminService.createPromocion(formData).subscribe({
        next: (response: any) => {
          this.notificationService.showSuccess('Promoción creada con éxito');
          this.closePromocionForm();
          this.loadPromociones();
        },
        error: (error) => {
          console.error('Error creating promocion:', error);
          this.notificationService.showError('Error al crear la promoción: ' + (error.error?.message || 'Error desconocido'));
        }
      });
    }
  }

  confirmDeletePromocion(id: number): void {
    this.deletePromocionId = id;
    this.showDeleteConfirm = true;
  }

  cancelDeletePromocion(): void {
    this.showDeleteConfirm = false;
    this.deletePromocionId = null;
  }

  deletePromocion(): void {
    if (!this.deletePromocionId) return;

    this.adminService.deletePromocion(this.deletePromocionId).subscribe({
      next: () => {
        this.notificationService.showSuccess('Promoción eliminada con éxito');
        this.loadPromociones();
        this.showDeleteConfirm = false;
        this.deletePromocionId = null;
      },
      error: (error) => {
        console.error('Error deleting promocion:', error);
        this.notificationService.showError('Error al eliminar la promoción: ' + (error.error?.message || 'Error desconocido'));
      }
    });
  }

  handleImageError(promocion: PromocionAPI): void {
    console.log('Error loading image for promocion:', promocion.id);
    // Set a default image or placeholder
    const imgElement = document.querySelector(`[data-promocion-id="${promocion.id}"] img`) as HTMLImageElement;
    if (imgElement) {
      imgElement.src = 'assets/promociones/default.png';
    }
  }

  getTipoPromocionName(id: number): string {
    const tipo = this.tiposPromocion.find(t => t.id === id);
    return tipo ? tipo.titol : 'General';
  }
}
