import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { CombinedBetComponent } from '../combined-bet/combined-bet.component';
import { RouterLink } from '@angular/router';
import { PredictionsService } from '../services/predictions.service';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

// Define interfaces for our data structures
interface PremioAPI {
  id: number;
  titol: string;
  descripcio: string;
  cost: number;
  condicio: number;
  image: string | null;
}

interface PremioUI {
  id: number;
  name: string;
  description: string;
  points: number;
  image: string;
  buttonText: string;
}

@Component({
  selector: 'app-premios',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    CombinedBetComponent,
    RouterLink
  ],
  templateUrl: './premios.component.html',
  styleUrls: ['./premios.component.css']
})
export class PremiosComponent implements OnInit {
  premios: PremioUI[] = [];
  premiosFiltrados: PremioUI[] = [];
  ordenAscendente = true;
  isLoading = true;
  errorMessage = '';
  
  constructor(
    private predictionsService: PredictionsService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}
  
  ngOnInit() {
    this.loadPremios();
  }
  
  loadPremios() {
    this.isLoading = true;
    this.predictionsService.getPremios().subscribe({
      next: (data: PremioAPI[]) => {
        this.premios = data.map((premio: PremioAPI): PremioUI => ({
          id: premio.id,
          name: premio.titol,
          description: premio.descripcio,
          points: premio.cost,
          image: premio.image ? `http://localhost:8000/${premio.image}` : 'assets/premios/default.png',
          buttonText: 'CANJEAR'
        }));
        this.premiosFiltrados = [...this.premios];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error cargando premios:', error);
        this.errorMessage = 'No se pudieron cargar los premios. Por favor, intenta de nuevo más tarde.';
        this.isLoading = false;
      }
    });
  }
  
  ordenarPorPuntos() {
    this.ordenAscendente = !this.ordenAscendente;
    
    if (this.ordenAscendente) {
      this.premiosFiltrados.sort((a, b) => a.points - b.points);
    } else {
      this.premiosFiltrados.sort((a, b) => b.points - a.points);
    }
  }
  
  onCanjear(premioId: number) {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.notificationService.showError('Debes iniciar sesión para canjear premios');
      return;
    }
    
    const premio = this.premios.find(p => p.id === premioId);
    if (!premio) return;
    
    // Use saldo instead of points for the user's balance
    if (currentUser.saldo < premio.points) {
      this.notificationService.showError('No tienes suficientes puntos para canjear este premio');
      return;
    }
    
    this.predictionsService.canjearPremio(premioId).subscribe({
      next: (response) => {
        this.notificationService.showSuccess('Premio canjeado con éxito');
        // Actualizar los puntos del usuario si es necesario
      },
      error: (error) => {
        console.error('Error al canjear premio:', error);
        this.notificationService.showError('Error al canjear el premio. Por favor, intenta de nuevo.');
      }
    });
  }
}
