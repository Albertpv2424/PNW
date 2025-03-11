import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BetSelectionsService, BetSelection } from '../services/bet-selections.service';

@Component({
  selector: 'app-combined-bet',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="combined-bet-panel" *ngIf="selections.length > 0" [class.minimized]="isMinimized">
      <div class="panel-header">
        <h3>Apuesta Combinada</h3>
        <button class="toggle-panel" (click)="toggleMinimize()">
          {{ isMinimized ? '▼' : '▲' }}
        </button>
        <button class="clear-button" (click)="clearSelections()">Limpiar</button>
      </div>
      
      <div class="selections-list">
        @for (selection of selections; track selection.matchId) {
          <div class="selection-item">
            <div class="match-info">{{ selection.matchInfo }}</div>
            <div class="bet-info">
              <span>{{ selection.teamName }} ({{ selection.betType }})</span>
              <span class="odds">{{ selection.odds }}</span>
            </div>
            <button class="remove-button" (click)="removeSelection(selection.matchId)">×</button>
          </div>
        }
      </div>

      <div class="total-section">
        <div class="total-odds">
          Cuota total: <span>{{ totalOdds | number:'1.2-2' }}</span>
        </div>
        <div class="bet-amount">
          <label>Cantidad:</label>
          <input type="number" [(ngModel)]="betAmount" min="1" step="1">
        </div>
        <div class="potential-win">
          Ganancia potencial: {{ betAmount * totalOdds | number:'1.2-2' }}€
        </div>
        <button class="place-bet-button" (click)="placeBet()" [disabled]="!betAmount || betAmount <= 0">
          Realizar Apuesta
        </button>
      </div>
    </div>
  `,
  styles: [`
    .combined-bet-panel {
      position: fixed;
      right: 20px;
      top: 120px; /* Aumentamos el top para que baje un poco más */
      width: 320px; /* Aumentamos ligeramente el ancho */
      max-height: 80vh; /* Limitamos la altura máxima al 80% de la ventana */
      overflow-y: auto; /* Añadimos scroll vertical si es necesario */
      background: #1e1e2d;
      border-radius: 8px;
      padding: 15px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
      z-index: 1000; /* Aseguramos que esté por encima de otros elementos */
    }

    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }

    .panel-header h3 {
      margin: 0;
      color: #fff;
    }

    .clear-button {
      background: #ff4444;
      color: white;
      border: none;
      padding: 5px 10px;
      border-radius: 4px;
      cursor: pointer;
    }

    .selections-list {
      max-height: 50vh; /* Limitamos la altura de la lista de selecciones */
      overflow-y: auto;
      margin-bottom: 10px;
    }

    /* Añadimos un botón para minimizar/maximizar el panel */
    .toggle-panel {
      position: absolute;
      top: 15px;
      right: 15px;
      background: none;
      border: none;
      color: #fff;
      cursor: pointer;
      font-size: 18px;
    }

    /* Estilo para el panel minimizado */
    .minimized {
      height: 40px;
      overflow: hidden;
    }

    .selection-item {
      background: #2a2a3c;
      border-radius: 4px;
      padding: 10px;
      margin-bottom: 8px;
      position: relative;
    }

    .match-info {
      font-size: 0.9em;
      color: #aaa;
      margin-bottom: 5px;
    }

    .bet-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #fff;
    }

    .odds {
      color: #00b341;
      font-weight: bold;
    }

    .remove-button {
      position: absolute;
      top: 5px;
      right: 5px;
      background: none;
      border: none;
      color: #ff4444;
      cursor: pointer;
      font-size: 18px;
    }

    .total-section {
      margin-top: 15px;
      padding-top: 15px;
      border-top: 1px solid #2a2a3c;
    }

    .total-odds {
      color: #fff;
      margin-bottom: 10px;
    }

    .bet-amount {
      margin-bottom: 10px;
    }

    .bet-amount input {
      width: 100%;
      padding: 8px;
      background: #2a2a3c;
      border: 1px solid #3a3a4c;
      color: #fff;
      border-radius: 4px;
    }

    .potential-win {
      color: #00b341;
      margin-bottom: 15px;
    }

    .place-bet-button {
      width: 100%;
      background: #00b341;
      color: white;
      border: none;
      padding: 10px;
      border-radius: 4px;
      cursor: pointer;
    }

    .place-bet-button:disabled {
      background: #666;
      cursor: not-allowed;
    }
  `]
})
export class CombinedBetComponent implements OnInit {
  selections: BetSelection[] = [];
  totalOdds: number = 1;
  betAmount: number = 10;

  constructor(private betSelectionsService: BetSelectionsService) {}

  ngOnInit() {
    this.betSelectionsService.getSelections().subscribe(selections => {
      this.selections = selections;
      this.totalOdds = this.betSelectionsService.calculateTotalOdds();
    });
  }

  removeSelection(matchId: string) {
    this.betSelectionsService.removeSelection(matchId);
  }

  clearSelections() {
    this.betSelectionsService.clearSelections();
  }

  placeBet() {
    if (this.betAmount <= 0) return;
    
    console.log('Apuesta combinada realizada:', {
      selections: this.selections,
      totalOdds: this.totalOdds,
      amount: this.betAmount,
      potentialWin: this.betAmount * this.totalOdds
    });
    
    // Aquí implementarías la lógica para enviar la apuesta al backend
    this.clearSelections();
  }
  
  // Añadimos una propiedad para controlar si el panel está minimizado
  isMinimized = false;

  // Método para alternar entre minimizado y maximizado
  toggleMinimize() {
    this.isMinimized = !this.isMinimized;
  }
}