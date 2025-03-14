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
    
    this.predictionsService.inscribirPromocion(promocionId).subscribe({
      next: (response) => {
        this.notificationService.showSuccess('Te has inscrito a la promoción con éxito');
      },
      error: (error) => {
        console.error('Error al inscribirse en la promoción:', error);
        this.notificationService.showError('Error al inscribirse en la promoción. Por favor, intenta de nuevo.');
      }
    });
  }
  
  formatDate(date: Date): string {
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}
