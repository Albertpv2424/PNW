import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BetSelectionsService, BetSelection } from '../services/bet-selections.service';
import { HeaderComponent } from '../header/header.component';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../services/notification.service';
import { AuthService } from '../services/auth.service'; // Add this import
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-combined-bet',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './combined-bet.component.html',
  styleUrls: ['./combined-bet.component.css']
})
export class CombinedBetComponent implements OnInit {
  selections: BetSelection[] = [];
  totalOdds: number = 1;
  betAmount: number = 10;
  isMinimized = false;
  menuOpen = false;

  constructor(
    private betSelectionsService: BetSelectionsService,
    private renderer: Renderer2,
    private el: ElementRef,
    private http: HttpClient,
    private notificationService: NotificationService,
    private authService: AuthService // Add AuthService
  ) { }

  ngOnInit() {
    this.betSelectionsService.getSelections().subscribe(selections => {
      this.selections = selections;
      this.totalOdds = this.betSelectionsService.calculateTotalOdds();
    });
    
    // Suscribirse a eventos del menú desplegable
    window.addEventListener('profile-menu-toggle', (event: any) => {
      this.menuOpen = event.detail.isOpen;
    });
  }

  removeSelection(matchId: string, teamName?: string) {
    // If teamName is not provided, get it from the selections
    if (!teamName) {
      const selection = this.selections.find(s => s.matchId === matchId);
      if (selection) {
        teamName = selection.teamName;
      } else {
        console.error('Selection not found for matchId:', matchId);
        return;
      }
    }
    
    this.betSelectionsService.removeSelection(matchId, teamName);
  }

  clearSelections() {
    this.betSelectionsService.clearSelections();
  }

  placeBet() {
    if (this.betAmount <= 0) return;
    
    // Obtener el token de autenticación
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No estás autenticado');
      this.notificationService.showError('Debes iniciar sesión para realizar apuestas');
      return;
    }
    
    // Preparar los datos de la apuesta
    const apuestaData = {
      cuota: this.totalOdds,
      punts_proposats: this.betAmount,
      selecciones: this.selections.map(s => ({
        matchId: s.matchId,
        teamName: s.teamName,
        betType: s.betType,
        odds: s.odds,
        matchInfo: s.matchInfo  // Make sure this field is included
      })),
      tipo_apuesta: this.selections.length === 1 ? 'simple' : 'parlay'
    };
    
    console.log('Sending bet data:', apuestaData);
    
    // Configurar los headers con el token
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    
    // Use environment API URL
    const apiUrl = environment.apiUrl;
    
    // Enviar la apuesta al backend
    this.http.post(`${apiUrl}/apuestas`, apuestaData, { headers })
      .subscribe({
        next: (response: any) => {
          console.log('Apuesta registrada con éxito:', response);
          
          // Get current user
          const currentUser = this.authService.getCurrentUser();
          if (currentUser) {
            // Calculate new balance
            const newBalance = currentUser.saldo - this.betAmount;
            
            // Update user balance through the auth service
            this.authService.updateUserSaldo(newBalance);
            console.log('Updated user balance:', newBalance);
          }
          
          this.notificationService.showSuccess('Apuesta registrada correctamente');
          this.clearSelections();
        },
        error: (error) => {
          console.error('Error al registrar la apuesta:', error);
          let errorMsg = 'Error al registrar la apuesta';
          
          if (error.error && error.error.error) {
            errorMsg += ': ' + error.error.error;
          } else if (error.error && error.error.message) {
            errorMsg += ': ' + error.error.message;
          } else if (error.statusText) {
            errorMsg += ': ' + error.statusText;
          }
          
          this.notificationService.showError(errorMsg);
        }
      });
}
  
  toggleMinimize() {
    this.isMinimized = !this.isMinimized;
  }
  
  // Add this method to your component class
  trackBySelection(index: number, selection: any): string {
    // Create a unique identifier using multiple properties
    return `${selection.matchId}_${selection.teamName}_${selection.betType}_${index}`;
  }
}