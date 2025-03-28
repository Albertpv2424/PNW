import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { CombinedBetComponent } from '../combined-bet/combined-bet.component';
import { PredictionsService } from '../services/predictions.service';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
import { HttpClient } from '@angular/common/http';

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

// Cerca del inicio del archivo, donde se definen las interfaces

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
    CombinedBetComponent
  ],
  templateUrl: './promociones.component.html',
  styleUrls: ['./promociones.component.css']
})
export class PromocionesComponent implements OnInit {
  promociones: PromocionUI[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(
    private predictionsService: PredictionsService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.loadPromociones();
  }

  loadPromociones() {
    this.isLoading = true;
    this.predictionsService.getPromociones().subscribe({
      next: (data: PromocionAPI[]) => {
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
            image: promo.image ? `http://localhost:8000/${promo.image}` : this.getDefaultImageUrl(),
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
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error cargando promociones:', error);
        this.errorMessage = 'No se pudieron cargar las promociones. Por favor, intenta de nuevo más tarde.';
        this.isLoading = false;
      }
    });
  }

  // Método para verificar inscripciones del usuario
  checkUserInscriptions() {
    const token = this.authService.getToken();
    if (!token) return;
    
    // Hacer una petición para obtener las inscripciones del usuario
    const url = `http://localhost:8000/api/user/inscripciones`;
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.setRequestHeader('Accept', 'application/json');
    
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          // Añadir verificación para asegurarse de que la respuesta es JSON
          const contentType = xhr.getResponseHeader('Content-Type');
          if (!contentType || !contentType.includes('application/json')) {
            return;
          }
          
          const response = JSON.parse(xhr.responseText);
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
        } catch (e) {
          console.error('Error al procesar las inscripciones:', e);
          console.error('Respuesta recibida:', xhr.responseText.substring(0, 150) + '...');
        }
      } else {
        console.error('Error en la solicitud de inscripciones:', xhr.status, xhr.statusText);
        console.error('Respuesta de error:', xhr.responseText.substring(0, 150) + '...');
      }
    };
    
    xhr.onerror = () => {
      console.error('Error de red al obtener inscripciones');
    };
    
    xhr.send();
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
    
    // Verificar que el token existe
    const token = this.authService.getToken();
    if (!token) {
      this.notificationService.showError('No se encontró tu token de autenticación. Por favor, inicia sesión nuevamente.');
      this.authService.logout();
      return;
    }

    console.log('Token antes de la solicitud:', token);
    console.log('Usuario actual:', currentUser);

    // Intentar una solicitud directa al backend
    const url = `http://localhost:8000/api/promociones/${promocionId}/inscribir`;
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Accept', 'application/json');

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
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
        } catch (e) {
          this.notificationService.showError('Error al procesar la respuesta del servidor');
        }
      } else {
        console.error('Error en la solicitud:', xhr.status, xhr.statusText);
        if (xhr.status === 401) {
          this.notificationService.showError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
          this.authService.logout();
        } else {
          try {
            const errorResponse = JSON.parse(xhr.responseText);
            this.notificationService.showError(errorResponse.message || 'Error al inscribirse en la promoción');
          } catch (e) {
            this.notificationService.showError('Error al inscribirse en la promoción. Por favor, intenta de nuevo.');
          }
        }
      }
    };

    xhr.onerror = () => {
      this.notificationService.showError('Error de red al realizar la solicitud');
    };

    xhr.send(JSON.stringify({}));
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
