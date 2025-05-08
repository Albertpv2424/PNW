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
    TranslateModule
  ],
  templateUrl: './promociones.component.html',
  styleUrls: ['./promociones.component.css']
})
export class PromocionesComponent implements OnInit, OnDestroy {
  promociones: PromocionUI[] = [];
  isLoading = false; // Cambiado a false para que no muestre el mensaje de carga
  errorMessage = '';
  
  // Suscripciones
  private langChangeSubscription: Subscription | null = null;
  private promocionesSubscription: Subscription | null = null;

  constructor(
    private predictionsService: PredictionsService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private http: HttpClient,
    private translateService: TranslateService,
    private promocionesService: PromocionesService // Añadido el servicio de promociones
  ) {}

  ngOnInit() {
    // Usar el servicio de promociones en lugar de cargar directamente
    this.promocionesSubscription = this.promocionesService.promociones$.subscribe({
      next: (data: PromocionAPI[]) => {
        this.procesarPromociones(data);
      },
      error: (error) => {
        console.error('Error cargando promociones:', error);
        this.errorMessage = 'No se pudieron cargar las promociones. Por favor, intenta de nuevo más tarde.';
        this.isLoading = false;
      }
    });
    
    // Suscribirse a cambios de idioma
    this.langChangeSubscription = this.translateService.onLangChange.subscribe(() => {
      // El servicio de promociones ya maneja el cambio de idioma
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

  procesarPromociones(data: PromocionAPI[]) {
    console.log('Promociones recibidas del servidor:', data.length);
    
    this.promociones = data.map((promo: PromocionAPI): PromocionUI => {
      // Verificar si la promoción ha expirado
      const isExpired = new Date(promo.data_final) < new Date();
      
      // Verificar si el usuario está inscrito (esto se actualizará después)
      const isInscrito = false;
      
      return {
        id: promo.id,
        title: promo.titol,
        description: promo.descripcio,
        startDate: new Date(promo.data_inici),
        endDate: new Date(promo.data_final),
        type: promo.tipoPromocion ? promo.tipoPromocion.titol : 'General',
        // Usar imagen del servidor o la imagen base64 por defecto
        image: promo.image ? `${environment.apiUrl.replace('/api', '')}/${promo.image}` : this.getDefaultImageUrl(),
        buttonText: isInscrito ? 'INSCRITO' : 'INSCRIBIRSE',
        isExpired: isExpired,
        isInscrito: isInscrito
      };
    });
    
    console.log('Promociones procesadas:', this.promociones.length);
    
    // Si el usuario está autenticado, verificar inscripciones
    if (this.authService.isLoggedIn()) {
      this.checkUserInscriptions();
    }
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
        
        console.log('Inscripciones recibidas:', inscripciones.length);
        
        // Actualizar el estado de inscripción de cada promoción
        this.promociones = this.promociones.map(promo => {
          const inscrito = inscripciones.some((insc: any) => insc.promo_id === promo.id);
          return {
            ...promo,
            isInscrito: inscrito,
            buttonText: inscrito ? 'INSCRITO' : 'INSCRIBIRSE'
          };
        });
      },
      error: (error) => {
        console.error('Error al obtener inscripciones:', error);
      }
    });
  }

  onInscribir(promocionId: number) {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.notificationService.showError('Debes iniciar sesión para inscribirte en promociones');
      return;
    }
    
    // Verificar si ya está inscrito o si la promoción ha expirado
    const promocion = this.promociones.find(p => p.id === promocionId);
    if (promocion) {
      if (promocion.isInscrito) {
        this.notificationService.showError('Ya estás inscrito en esta promoción');
        return;
      }
      
      if (promocion.isExpired) {
        this.notificationService.showError('Esta promoción ha finalizado');
        return;
      }
    }
    
    // Usar HttpClient en lugar de XMLHttpRequest
    this.http.post(`${environment.apiUrl}/promociones/${promocionId}/inscribir`, {}, {
      headers: this.authService.getAuthHeaders()
    }).subscribe({
      next: (response: any) => {
        this.notificationService.showSuccess(response.message || 'Te has inscrito a la promoción con éxito');

        // Update user balance if it was changed (e.g., welcome bonus)
        if (response.saldo_actual !== undefined) {
          this.authService.updateUserSaldo(response.saldo_actual);
        }

        // Actualizar el texto del botón y el estado de inscripción
        const promocionIndex = this.promociones.findIndex(p => p.id === promocionId);
        if (promocionIndex !== -1) {
          this.promociones[promocionIndex].buttonText = 'INSCRITO';
          this.promociones[promocionIndex].isInscrito = true;
        }
      },
      error: (error) => {
        console.error('Error al inscribirse en la promoción:', error);
        
        if (error.status === 401) {
          this.notificationService.showError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
          this.authService.logout();
        } else {
          this.notificationService.showError(error.error?.message || 'Error al inscribirse en la promoción');
        }
      }
    });
  }

  // Método para formatear fechas
  formatDate(date: Date): string {
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  // Método para manejar errores de carga de imágenes
  handleImageError(event: any, promocion: PromocionUI): void {
    console.log('Error al cargar la imagen de la promoción:', promocion.id);
    // Usar una imagen en base64 para evitar problemas de 404
    event.target.src = this.getDefaultImageUrl();
  }

  // Método para obtener una URL de imagen por defecto en base64
  getDefaultImageUrl(): string {
    // Imagen simple en base64 (un rectángulo oscuro con texto "Promoción")
    return 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMzAwIDIwMCI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiMxZTFlMzAiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iI2NjYyI+UHJvbW9jacOzbjwvdGV4dD48L3N2Zz4=';
  }
}
