import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { CombinedBetComponent } from '../combined-bet/combined-bet.component';
import { PredictionsService } from '../services/predictions.service';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

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
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.loadPromociones();
  }

  loadPromociones() {
    this.isLoading = true;
    this.predictionsService.getPromociones().subscribe({
      next: (data: PromocionAPI[]) => {
        this.promociones = data.map((promo: PromocionAPI): PromocionUI => ({
          id: promo.id,
          title: promo.titol,
          description: promo.descripcio,
          startDate: new Date(promo.data_inici),
          endDate: new Date(promo.data_final),
          type: promo.tipoPromocion ? promo.tipoPromocion.titol : 'General',
          // Corregir el formato de la URL
          image: promo.image ? `http://localhost:8000/${promo.image}` : 'assets/promociones/default.png',
          buttonText: 'INSCRIBIRSE'
        }));
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error cargando promociones:', error);
        this.errorMessage = 'No se pudieron cargar las promociones. Por favor, intenta de nuevo más tarde.';
        this.isLoading = false;
      }
    });
  }

  onInscribir(promocionId: number) {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.notificationService.showError('Debes iniciar sesión para inscribirte en promociones');
      return;
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

          // Actualizar el texto del botón
          const promocionIndex = this.promociones.findIndex(p => p.id === promocionId);
          if (promocionIndex !== -1) {
            this.promociones[promocionIndex].buttonText = 'INSCRITO';
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

  formatDate(date: Date): string {
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}
