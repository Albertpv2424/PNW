
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

interface PromocionAPI {
  id: number;
  titol: string;
  descripcio: string;
  data_inici: string;
  data_final: string;
  image: string | null;
  tipus_promocio: number;
  tipoPromocion?: {
    id: number;
    titol: string; 
  }
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
      image: ['']
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

    if (!isAdmin) {
      console.error('User is not admin, redirecting to home');
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
    
    console.log('Starting loadPromociones method');

    const token = this.authService.getToken();
    console.log('Using token (first 10 chars):', token ? token.substring(0, 10) + '...' : 'No token');

    const headers = this.authService.getAuthHeaders();
    console.log('Headers:', headers);

    this.http.get<PromocionAPI[]>(`${environment.apiUrl}/admin/promotions`, {
      headers: this.authService.getAuthHeaders()
    }).subscribe({
      next: (data) => {
        console.log('Promos loaded successfully:', data);
        
        // Make sure we're correctly mapping the data
        this.promociones = data.map(promocion => ({
          ...promocion,
          image: promocion.image ? `http://localhost:8000/${promocion.image}` : 'assets/premios/default.png'
        }));
        
        this.filteredPromociones = [...this.promociones];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading promos:', error);
        this.notificationService.showError('Error al cargar las promociones:'+ (error.error?.message || 'Error desconocido'));
        this.isLoading = false;  
      }
    });
  }

  loadTiposPromocion(): void {
    const token = this.authService.getToken();
    console.log('Using token (first 10 chars):', token ? token.substring(0, 10) + '...' : 'No token');

    const headers = this.authService.getAuthHeaders();
    console.log('Headers:', headers);

    // Try with the correct endpoint URL
    this.http.get<TipoPromocion[]>(`${environment.apiUrl}/admin/tipos-promocion`, {
      headers: this.authService.getAuthHeaders()
    }).subscribe({
      next: (data) => {
        console.log('Tipos de promoción cargados:', data);
        if (Array.isArray(data) && data.length > 0) {
          this.tiposPromocion = data;
          // Force refresh of the promotion list
          this.filteredPromociones = [...this.promociones];
        } else {
          console.error('Received empty or invalid tipos promocion data:', data);
        }
      },
      error: (error) => {
        console.error('Error loading tipos promocion:', error);
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

  openPromocionForm(promocion?: PromocionAPI): void {
    this.isEditing = !!promocion;
    this.selectedPromocion = promocion || null;
    this.imagePreview = null;
    this.selectedFile = null;
    this.selectedFileName = null;
  
    if (promocion) {
    // Editing existing promotion
    this.promocionForm.patchValue({
      titol: promocion.titol,
      descripcio: promocion.descripcio,
      data_inici: promocion.data_inici,
      data_final: promocion.data_final,
      tipus_promocio: promocion.tipus_promocio  
    });
    
    if (promocion.image && !promocion.image.includes('default.png')) {
      this.imagePreview = promocion.image.startsWith('http')
        ? promocion.image
        : `${environment.apiUrl.replace('/api', '')}/${promocion.image}`;
    }
    }else{
      // Creating new promotion - set default values
      this.promocionForm.reset({
        titol: '',
        descripcio: '',
        data_inici: new Date().toISOString().split('T')[0],
        data_final: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
        tipus_promocio: this.tiposPromocion.length > 0 ? this.tiposPromocion[0].id : ''
      });
    }
  
    // Show the form modal
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
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      
      // Create a preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  submitPromocionForm(): void {
    if (this.promocionForm.invalid) {
      this.notificationService.showError('Por favor, completa todos los campos requeridos');
      return;
    }
    console.log('Form values:', this.promocionForm.value);

    const promocionData = this.promocionForm.value;
if (this.selectedFile) {

  const formData = new FormData();
    

    // Append each field to the FormData except for the image
    formData.append('titol', promocionData.titol || '');
    formData.append('descripcio', promocionData.descripcio || '');
    formData.append('data_inici', promocionData.data_inici || '');
    formData.append('data_final', promocionData.data_final || '');
    formData.append('tipus_promocio', promocionData.tipus_promocio || '');
    formData.append('image', this.selectedFile );

    console.log('Using FormData for submission with image');

    const options = {
      headers: {
        'Authorization': `Bearer ${this.authService.getToken()}`,
        'Accept': 'application/json'
      }
    };
    this.submitRequest(formData, options);
    
  } else {
    console.log('Using JSON for submission without image');

    const jsonData = {
      titol: promocionData.titol,
      descripcio: promocionData.descripcio,
      data_inici: promocionData.data_inici,
      data_final: promocionData.data_final,
      tipus_promocio: promocionData.tipus_promocio
    };

    console.log('JSON data to submit:', jsonData);

    const options = {
      headers: {
        'Authorization': `Bearer ${this.authService.getToken()}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };

    this.submitRequest(jsonData, options);
  }
  }
  savePromocion(): void {
    
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
      console.error('No promocion selected for deletion');
      return;
    }
    this.http.delete(`${environment.apiUrl}/admin/promotions/${this.deletePromocionId}`, {
      headers: this.authService.getAuthHeaders() 
    }).subscribe({
      next: (response) => {
        console.log('Promocion deleted successfully');
        this.notificationService.showSuccess('Promoción eliminada correctamente');
        this.loadPromociones();
        this.cancelDelete();
        this.showDeleteConfirm = false;
        this.deletePromocionId = null;
      },
      error: (error) => {
        console.error('Error deleting promocion:', error);
        this.notificationService.showError('Error al eliminar la promoción:'+ (error.error?.message || 'Error desconocido')); 
      } 
    })

  }

  getTipoPromocionName(id: number): string {
    // Add debugging to see what's happening
    console.log('Getting tipo promocion name for id:', id);
    console.log('Available tipos promocion:', this.tiposPromocion);
    
    if (!id) return 'No especificado';
    
    // Convert id to number to ensure proper comparison
    const numericId = Number(id);
    const tipo = this.tiposPromocion.find(t => Number(t.id) === numericId);
    
    if (tipo) {
      console.log('Found matching tipo:', tipo);
      return tipo.titol;
    } else {
      console.log('No matching tipo found for id:', id);
      return 'No especificado';
    }
  }






private submitRequest(data: any, options: any): void {
  const endpoint = this.isEditing && this.selectedPromocion 
    ? `${environment.apiUrl}/admin/promotions/${this.selectedPromocion.id}`
    : `${environment.apiUrl}/admin/promotions`;
    
  this.http.post(endpoint, data, options).subscribe({
    next: (response) => {
      console.log('Promotion operation successful:', response);
      this.notificationService.showSuccess(
        this.isEditing ? 'Promoción actualizada correctamente' : 'Promoción creada correctamente'
      );
      this.loadPromociones();
      this.closePromocionForm();
    },
    error: (error) => {
      console.error('Error with promotion operation:', error);
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