import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { CombinedBetComponent } from '../combined-bet/combined-bet.component';
import { PredictionsService } from '../services/predictions.service';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { environment } from '../../environments/environment';
import { Subscription } from 'rxjs';
import { PromocionesService } from '../services/promociones.service';
// Add these imports for form handling
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

// Define interfaces for our data structures
interface PromocionAPI {
  id: number;
  titol: string;
  descripcio: string;
  data_inici: string;
  data_final: string;
  tipus_promocio: number;
  image: string | null;
  tipoPromocion?: {
    titol: string;
  };
}

interface PromocionUI {
  id: number;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  type: string;
  image: string;
  buttonText: string;
  isExpired: boolean;
  isInscrito: boolean;
}

@Component({
  selector: 'app-promociones',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    CombinedBetComponent,
    TranslateModule,
    ReactiveFormsModule // Add this import
  ],
  templateUrl: './promociones.component.html',
  styleUrls: ['./promociones.component.css']
})
export class PromocionesComponent implements OnInit, OnDestroy {
  promociones: PromocionUI[] = [];
  isLoading = false;
  errorMessage = '';

  // Suscripciones
  private langChangeSubscription: Subscription | null = null;
  private promocionesSubscription: Subscription | null = null;

  // Add these properties to your component class
  imagePreview: string | null = null;
  promocionForm: FormGroup;
  isEditing: boolean = false;
  selectedPromocion: any = null;

  constructor(
    private predictionsService: PredictionsService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private http: HttpClient,
    private translateService: TranslateService,
    private promocionesService: PromocionesService,
    private fb: FormBuilder // Add FormBuilder
  ) {
    // Initialize the form
    this.promocionForm = this.fb.group({
      titol: ['', Validators.required],
      descripcio: ['', Validators.required],
      data_inici: ['', Validators.required],
      data_final: ['', Validators.required],
      tipus_promocio: [1, Validators.required],
      imageUrl: ['']
    });
  }

  ngOnInit() {
    // Establecer el título de la página basado en el idioma actual
    this.translateService.get('PROMOTIONS.TITLE').subscribe((title: string) => {
      document.title = `PNW - ${title}`;
    });

    // Usar el servicio de promociones en lugar de cargar directamente
    this.promocionesSubscription = this.promocionesService.promociones$.subscribe({
      next: (data: PromocionAPI[]) => {
        this.procesarPromociones(data);
      },
      error: (error) => {
        this.translateService.get('PROMOTIONS.ERROR_LOADING').subscribe((message: string) => {
          this.errorMessage = message;
        });
        this.isLoading = false;
      }
    });

    // Suscribirse a cambios de idioma
    this.langChangeSubscription = this.translateService.onLangChange.subscribe(() => {
      // Actualizar el título de la página cuando cambia el idioma
      this.translateService.get('PROMOTIONS.TITLE').subscribe((title: string) => {
        document.title = `PNW - ${title}`;
      });
    });

    // Si el usuario está autenticado, verificar inscripciones
    if (this.authService.isLoggedIn()) {
      this.checkUserInscriptions();
    }
  }

  ngOnDestroy() {
    // Limpiar suscripciones al destruir el componente
    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }
    if (this.promocionesSubscription) {
      this.promocionesSubscription.unsubscribe();
    }
  }

  // Keep only one version of procesarPromociones
  procesarPromociones(data: PromocionAPI[]) {
    this.promociones = data.map((promo: PromocionAPI): PromocionUI => {
      // Verificar si la promoción ha expirado
      const isExpired = new Date(promo.data_final) < new Date();

      // Verificar si el usuario está inscrito (esto se actualizará después)
      const isInscrito = false;

      // Obtener textos traducidos para los botones
      let buttonText = '';
      this.translateService.get(isInscrito ? 'PROMOTIONS.INSCRITO' : 'PROMOTIONS.INSCRIBIRSE').subscribe((text: string) => {
        buttonText = text;
      });

      return {
        id: promo.id,
        title: promo.titol,
        description: promo.descripcio,
        startDate: new Date(promo.data_inici),
        endDate: new Date(promo.data_final),
        type: promo.tipoPromocion ? promo.tipoPromocion.titol : this.getDefaultTypeText(),
        image: this.getImageUrl(promo.image), // Use getImageUrl here
        buttonText: buttonText,
        isExpired: isExpired,
        isInscrito: isInscrito
      };
    });

  // Si el usuario está autenticado, verificar inscripciones
  if (this.authService.isLoggedIn()) {
    this.checkUserInscriptions();
  }
  }

  // Método para obtener el texto por defecto para el tipo de promoción
  getDefaultTypeText(): string {
    let defaultText = 'General';
    this.translateService.get('PROMOTIONS.TIPO_DEFAULT').subscribe((text: string) => {
      defaultText = text;
    });
    return defaultText;
  }

  // Método para verificar inscripciones del usuario
  checkUserInscriptions() {
    const token = this.authService.getToken();
    if (!token) return;

    // Usar HttpClient en lugar de XMLHttpRequest para mantener consistencia
    this.http.get(`${environment.apiUrl}/user/inscripciones`, {
      headers: this.authService.getAuthHeaders()
    }).subscribe({
      next: (response: any) => {
        const inscripciones = response.inscripciones || [];


        // Actualizar el estado de inscripción de cada promoción
        this.promociones = this.promociones.map(promo => {
          const inscrito = inscripciones.some((insc: any) => insc.promo_id === promo.id);

          // Obtener texto traducido para el botón
          let buttonText = '';
          this.translateService.get(inscrito ? 'PROMOTIONS.INSCRITO' : 'PROMOTIONS.INSCRIBIRSE').subscribe((text: string) => {
            buttonText = text;
          });

          return {
            ...promo,
            isInscrito: inscrito,
            buttonText: buttonText
          };
        });
      },
      error: (error) => {
      }
    });
  }

  // Remove this entire method (the first implementation)
  /*
  onInscribir(promocionId: number) {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.translateService.get('PROMOTIONS.ERROR_LOGIN_REQUIRED').subscribe((message: string) => {
        this.notificationService.showError(message);
      });
      return;
    }

    // Verificar si ya está inscrito o si la promoción ha expirado
    const promocion = this.promociones.find(p => p.id === promocionId);
    if (promocion) {
      if (promocion.isInscrito) {
        this.translateService.get('PROMOTIONS.ERROR_YA_INSCRITO').subscribe((message: string) => {
          this.notificationService.showError(message);
        });
        return;
      }

      if (promocion.isExpired) {
        this.translateService.get('PROMOTIONS.ERROR_PROMOCION_FINALIZADA').subscribe((message: string) => {
          this.notificationService.showError(message);
        });
        return;
      }
    }

    // Usar HttpClient en lugar de XMLHttpRequest
    this.http.post(`${environment.apiUrl}/promociones/${promocionId}/inscribir`, {}, {
      headers: this.authService.getAuthHeaders()
    }).subscribe({
      next: (response: any) => {
        this.translateService.get('PROMOTIONS.SUCCESS_INSCRIPCION').subscribe((message: string) => {
          this.notificationService.showSuccess(response.message || message);
        });

        // Update user balance if it was changed (e.g., welcome bonus)
        if (response.saldo_actual !== undefined) {
          this.authService.updateUserSaldo(response.saldo_actual);
        }

        // Actualizar el texto del botón y el estado de inscripción
        const promocionIndex = this.promociones.findIndex(p => p.id === promocionId);
        if (promocionIndex !== -1) {
          this.translateService.get('PROMOTIONS.INSCRITO').subscribe((text: string) => {
            this.promociones[promocionIndex].buttonText = text;
          });
          this.promociones[promocionIndex].isInscrito = true;
        }
      },
      error: (error) => {

        if (error.status === 401) {
          this.translateService.get('PROMOTIONS.ERROR_SESSION_EXPIRED').subscribe((message: string) => {
            this.notificationService.showError(message);
          });
          this.authService.logout();
        } else {
          this.translateService.get('PROMOTIONS.ERROR_INSCRIPCION').subscribe((message: string) => {
            this.notificationService.showError(error.error?.message || message);
          });
        }
      }
    });
  }
  */

  // Método para formatear fechas
  formatDate(date: Date): string {
    return date.toLocaleDateString(this.translateService.currentLang === 'en' ? 'en-US' : 'es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
  // Método para obtener una URL de imagen por defecto en base64
  getDefaultImageUrl(): string {
    // Imagen simple en base64 (un rectángulo oscuro con texto "Promoción")
    return 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMzAwIDIwMCI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiMxZTFlMzAiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iI2NjYyI+UHJvbW9jacOzbjwvdGV4dD48L3N2Zz4=';
  }


onInscribir(promocion: any): void {
  // Verificar explícitamente si es el bono de bienvenida por su título
  const isWelcomeBonus =
    (promocion.title && promocion.title.toLowerCase().includes('bienvenida')) ||
    (promocion.titol && promocion.titol.toLowerCase().includes('bienvenida')) ||
    (promocion.title && promocion.title.toLowerCase().includes('benvenuto')) ||
    (promocion.titol && promocion.titol.toLowerCase().includes('benvenuto'));

  console.log('Inscribiendo en promoción:', promocion);
  console.log('¿Es bono de bienvenida?:', isWelcomeBonus);

  // Llamada directa al endpoint específico para el bono de bienvenida
  if (isWelcomeBonus) {
    // Usar el servicio específico para el bono de bienvenida
    this.promocionesService.inscribirEnBonoBienvenida().subscribe({
      next: (response: any) => {
        console.log('Respuesta de inscripción al bono:', response);
        this.notificationService.showSuccess(response.message || 'Te has inscrito correctamente al bono de bienvenida');

        // Actualizar el saldo del usuario si se devolvió en la respuesta
        if (response.saldo_actual !== undefined) {
          console.log('Actualizando saldo a:', response.saldo_actual);
          this.authService.updateUserSaldo(response.saldo_actual);
        }

        // Actualizar el estado de la promoción
        promocion.isInscrito = true;
        this.translateService.get('PROMOTIONS.INSCRITO').subscribe((text: string) => {
          promocion.buttonText = text;
        });
      },
      error: (error) => {
        console.error('Error en inscripción al bono:', error);
        this.handleError(error);
      }
    });
  } else {
    // Promoción regular - usar el servicio normal
    this.promocionesService.inscribirEnPromocion(promocion.id).subscribe({
      next: (response) => {
        this.notificationService.showSuccess(response.message);
        promocion.isInscrito = true;
        this.translateService.get('PROMOTIONS.INSCRITO').subscribe((text: string) => {
          promocion.buttonText = text;
        });
      },
      error: (error) => this.handleError(error)
    });
  }
}

private handleError(error: any): void {
  if (error.status === 401) {
    this.notificationService.showError('Debes iniciar sesión para inscribirte en esta promoción');
    this.authService.logout();
  } else {
    this.notificationService.showError(error.error?.message || 'Error al inscribirse en la promoción');
  }
}

// Add these methods for form handling
// Replace the loadPromociones method with this implementation
loadPromociones(): void {
// This will trigger a reload of promotions
this.isLoading = true;
this.http.get(`${environment.apiUrl}/promociones`, {
headers: {
'Accept-Language': this.translateService.currentLang
}
}).subscribe({
next: (data: any) => {
this.promocionesService.updatePromociones(data.promociones || []);
this.isLoading = false;
},
error: (error) => {
console.error('Error loading promotions:', error);
this.isLoading = false;
this.translateService.get('PROMOTIONS.ERROR_LOADING').subscribe((message: string) => {
this.errorMessage = message;
});
}
});
}

closePromocionForm(): void {
  this.showPromocionForm = false;
  this.isEditing = false;
  this.selectedPromocion = null;
  this.imagePreview = null;
  this.promocionForm.reset();
}

// Add this property
showPromocionForm: boolean = false;

// Método para formatear fechas
onImageUrlChange(): void {
  const imageUrl = this.promocionForm.get('imageUrl')?.value;
  if (imageUrl) {
    this.imagePreview = imageUrl;
  } else {
    this.imagePreview = null;
  }
}

// Update the submitPromocionForm method to properly handle the image URL
submitPromocionForm(): void {
  if (this.promocionForm.invalid) {
    // Mark all fields as touched to trigger validation messages
    Object.keys(this.promocionForm.controls).forEach(key => {
      this.promocionForm.get(key)?.markAsTouched();
    });
    return;
  }

  const formData = this.promocionForm.value;

  // Create the data object to send
  const promocionData = {
    titol: formData.titol,
    descripcio: formData.descripcio,
    data_inici: formData.data_inici,
    data_final: formData.data_final,
    tipus_promocio: formData.tipus_promocio,
    image: formData.imageUrl // Use the imageUrl field from the form
  };

  console.log('Submitting promotion data:', promocionData);

  // Set up request options
  const options = {
    headers: this.authService.getAuthHeaders()
  };

  // Submit the request
  if (this.isEditing && this.selectedPromocion) {
    // Update existing promotion
    this.http.put(`${environment.apiUrl}/admin/promotions/${this.selectedPromocion.id}`, promocionData, options)
      .subscribe({
        next: (response) => {
          console.log('Promotion updated successfully:', response);
          this.notificationService.showSuccess('Promoción actualizada correctamente');
          this.loadPromociones();
          this.closePromocionForm();
        },
        error: (error) => {
          console.error('Error updating promotion:', error);
          this.notificationService.showError(
            'Error: ' + (error.error?.message || 'No se pudo actualizar la promoción')
          );
        }
      });
  } else {
    // Create new promotion
    this.http.post(`${environment.apiUrl}/admin/promotions`, promocionData, options)
      .subscribe({
        next: (response) => {
          console.log('Promotion created successfully:', response);
          this.notificationService.showSuccess('Promoción creada correctamente');
          this.loadPromociones();
          this.closePromocionForm();
        },
        error: (error) => {
          console.error('Error creating promotion:', error);
          this.notificationService.showError(
            'Error: ' + (error.error?.message || 'No se pudo crear la promoción')
          );
        }
      });
  }
}

getImageUrl(imagePath: string | null): string {
  if (!imagePath) return this.getDefaultImageUrl();

  // Check if the image path already includes http or https
  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  // If it's a relative path, prepend the API base URL
  if (!imagePath.startsWith('assets/') && !imagePath.startsWith('data:')) {
    return `${environment.apiUrl.replace('/api', '')}/${imagePath}`;
  }

  return imagePath;
}

// Make sure this method is implemented
handleImageError(event: Event): void {
  const target = event.target as HTMLImageElement;
  if (target) {
    target.src = this.getDefaultImageUrl();
  }
}

// Remove the duplicate procesarPromociones method
}



