import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BetSelectionsService, BetSelection } from '../services/bet-selections.service';
import { HeaderComponent } from '../header/header.component';

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
    private el: ElementRef
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
  
  toggleMinimize() {
    this.isMinimized = !this.isMinimized;
  }
}