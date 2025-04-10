import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { CombinedBetComponent } from '../combined-bet/combined-bet.component';
import { PredictionsService } from '../services/predictions.service';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
import { PremiosService } from '../services/premios.service';

// Define interfaces for our data structures
interface PremioAPI {
  id: number;
  titol: string;
  descripcio: string;
  cost: number; // Asegúrate de que este campo coincida con el backend
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
    CombinedBetComponent
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
    private notificationService: NotificationService,
    private premiosService: PremiosService
  ) {}

  ngOnInit() {
    // Subscribe to the premios$ observable from PremiosService
    this.isLoading = true;
    this.premiosService.premios$.subscribe({
      next: (data: PremioAPI[]) => {
        console.log('Datos recibidos del servidor:', data);
        this.premios = data.map((premio: PremioAPI): PremioUI => ({
          id: premio.id,
          name: premio.titol,
          description: premio.descripcio,
          points: premio.cost, // Asegúrate de que este campo coincida con el backend
          image: premio.image ? `http://localhost:8000/${premio.image}` : 'assets/premios/default.png',
          buttonText: 'CANJEAR'
        }));
        this.premiosFiltrados = [...this.premios];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading prizes:', error);
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
    // Force refresh the user data from localStorage
    const storedUser = localStorage.getItem('currentUser');
    let currentUser = this.authService.getCurrentUser();
  
    if (storedUser) {
      // Parse the stored user data to ensure we have the latest
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser && parsedUser.saldo !== undefined) {
        // If the stored saldo is different, update the current user
        if (!currentUser || currentUser.saldo !== parsedUser.saldo) {
          currentUser = parsedUser;
          this.authService.updateCurrentUser(parsedUser);
        }
      }
    }
  
    if (!currentUser) {
      this.notificationService.showError('Debes iniciar sesión para canjear premios');
      return;
    }
  
    const premio = this.premios.find(p => p.id === premioId);
    if (!premio) return;
  
    // Log both values for debugging
    console.log('User balance:', currentUser.saldo, 'Prize cost:', premio.points);
  
    // Use saldo instead of points for the user's balance
    if (currentUser.saldo < premio.points) {
      this.notificationService.showError(`No tienes suficientes puntos para canjear este premio. Tienes ${currentUser.saldo} puntos y necesitas ${premio.points}.`);
      return;
    }
  
    // Show info notification
    this.notificationService.showInfo('Procesando tu solicitud...');
  
    // Use the PremiosService instead of PredictionsService
    this.premiosService.redeemPremio(premioId).subscribe({
      next: (response) => {
        console.log('Full redemption response:', response);
        this.notificationService.showSuccess('Premio canjeado con éxito');
  
        // Update the user's balance with the new value from the response
        if (response && response.saldo_actual !== undefined) {
          console.log('New balance from server:', response.saldo_actual);
          this.authService.updateUserSaldo(response.saldo_actual);
        } else {
          console.log('Response missing saldo_actual, calculating manually');
          // Calculate new balance manually
          const newBalance = currentUser.saldo - premio.points;
          console.log('New calculated balance:', newBalance);
          this.authService.updateUserSaldo(newBalance);
        }
  
        // Reload the page after a short delay to reflect changes
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      },
      error: (error) => {
        console.error('Error al canjear premio:', error);
        let errorMessage = 'Error al canjear el premio. Por favor, intenta de nuevo.';
  
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
  
        this.notificationService.showError(errorMessage);
      }
    });
  }
}
